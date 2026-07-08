from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, case, or_
from datetime import date, timedelta
import pandas as pd
import io
import csv
from calendar import monthrange
from fastapi.responses import StreamingResponse
from app.db.session import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.user import UserCreate


router = APIRouter(prefix="/admin", tags=["admin"])

def calc(db,days):
    start = (date.today() - timedelta(days=days))
    rows = (
        db.query(
            Order.beverage,
            func.sum(
                Order.quantity
            )
        )
        .filter(Order.order_date >= start)
        .group_by(Order.beverage)
        .all()
    )

    tea = 0
    coffee = 0

    for r in rows:
        if r[0] == "tea":
            tea = r[1]
        if r[0] == "coffee":
            coffee = r[1]

    return {
        "tea": tea,
        "coffee": coffee
    }

def beverage_totals(query):
    rows = (
        query
        .with_entities(
            Order.beverage,
            func.sum(Order.quantity)
        )
        .group_by(Order.beverage)
        .all()
    )

    tea = 0
    coffee = 0

    for beverage, qty in rows:
        if beverage == "tea":
            tea = qty or 0
        elif beverage == "coffee":
            coffee = qty or 0

    return tea, coffee

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    today = date.today()
    rows = (
        db.query(
            Order.beverage,
            func.sum(Order.quantity)
        )
        .filter(
            Order.order_date == today
        )
        .group_by(
            Order.beverage
        )
        .all()
    )

    tea = 0
    coffee = 0

    for beverage, qty in rows:
        if beverage == "tea":
            tea = qty or 0
        elif beverage == "coffee":
            coffee = qty or 0

    return {"tea": tea,"coffee": coffee}

@router.get("/location-summary")
def location_summary(period: str = "today",db: Session = Depends(get_db)):

    today = date.today()

    if period == "month":
        start = today.replace(day=1)
        end = today
    else:
        start = today
        end = today

    rows = (
        db.query(
            Order.location,
            Order.beverage,
            func.sum(Order.quantity)
        )
        .filter(
            Order.order_date >= start,
            Order.order_date <= end
        )
        .group_by(
            Order.location,
            Order.beverage
        )
        .all()
    )

    locations = {}

    for location, beverage, qty in rows:
        if location not in locations:
            locations[location] = {
                "tea": 0,
                "coffee": 0
            }
        locations[location][beverage] = qty or 0
    result = []

    for location, value in locations.items():
        result.append({
            "location": location,
            "tea": value["tea"],
            "coffee": value["coffee"],
            "total": value["tea"] + value["coffee"]
        })

    return result

@router.get("/analytics")
def analytics(
    search: str | None = None,
    location: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    compare_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):

    today = date.today()
    query = (
        db.query(User, Order)
        .join(Order, User.id == Order.user_id)
    )

# Search
    if search:
        search = search.strip()
        query = query.filter(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.employee_code.ilike(f"%{search}%"),
            )
        )

# Location
    if location:
        query = query.filter(
            Order.location == location
        )

# Date Filters
    if date_from:
        query = query.filter(
        Order.order_date >= date_from
    )
    if date_to:
        query = query.filter(
        Order.order_date <= date_to
    )

# Pagination
    total = query.count()
    rows = (
        query
        .order_by(Order.order_date.desc(),Order.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    results = []

    for user, order in rows:
        results.append({
            "id": order.id,
            "name": user.name,
            "employee_code": user.employee_code,
            "email": user.email,
            "location": order.location,
            "beverage": order.beverage,
            "quantity": order.quantity,
            "date": order.order_date,
        })

# Dashboard Summary (TODAY ONLY)
    tea = (
        db.query(func.sum(Order.quantity))
        .filter(
            Order.beverage == "tea",
            Order.order_date == today,
        )
        .scalar()
        or 0
    )

    coffee = (
        db.query(func.sum(Order.quantity))
        .filter(
            Order.beverage == "coffee",
            Order.order_date == today,
        )
        .scalar()
        or 0
    )

    today_count = (
        db.query(func.sum(Order.quantity))
        .filter(Order.order_date == today)
        .scalar()
        or 0
    )

    week_count = (
        db.query(func.sum(Order.quantity))
        .filter(
            Order.order_date >= today - timedelta(days=7)
        )
        .scalar()
        or 0
    )

    first_day = today.replace(day=1)

    month_count = (
        db.query(func.sum(Order.quantity))
        .filter(
            Order.order_date >= first_day,
            Order.order_date <= today
        )
        .scalar()
        or 0
    )

    compare = None

    if compare_date:

        selected = (
            db.query(func.sum(Order.quantity))
            .filter(Order.order_date == compare_date)
            .scalar()
            or 0
        )

        compare = {
            "selected_day": selected,
            "today": today_count,
        }

    return {
        "summary": {
            "tea": tea,
            "coffee": coffee,
            "today": today_count,
            "week": week_count,
            "month": month_count,
        },
        "compare": compare,
        "results": results,
        "total": total,
        "page": page,
        "limit": limit,
    }

@router.get("/export")
def export_csv(
    search: str | None = None,
    location: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    db: Session = Depends(get_db),
):

    q = (
        db.query(
            User.employee_code,
            User.name,
            User.email,
            Order.location,
            Order.order_date,
            Order.beverage,
            Order.quantity,
        )
        .join(Order, User.id == Order.user_id)
    )

    if search:
        q = q.filter(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.employee_code.ilike(f"%{search}%")
            )
        )
    if location:
        q = q.filter(
            Order.location == location
        )

    if date_from:
        q = q.filter(
            Order.order_date >= date_from
        )

    if date_to:
        q = q.filter(
            Order.order_date <= date_to
        )

    rows = q.order_by(
        Order.order_date.desc()
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Employee Code",
        "Employee Name",
        "Email",
        "Location",
        "Date",
        "Beverage",
        "Quantity",
    ])

    for row in rows:
        writer.writerow(row)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=tea-report.csv"
        },
    )

@router.get("/users")
def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(User).count()

    users = (
        db.query(User)
        .order_by(User.name)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "results": [
            {
                "id": u.id,
                "employee_code": u.employee_code,
                "name": u.name,
                "email": u.email,
                "location": u.location,
                "role": u.role,
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }

@router.post("/users")
def create_user(

    data: UserCreate,
    db: Session = Depends(
        get_db
    )
):

    user = User(
        name=data.name,
        employee_code=data.employee_code,
        email=data.email,
        password=data.password,
        role=data.role,
	location=data.location
    )

    db.add(user)
    db.commit()

    return {
        "message":
        "user created"
    }

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data: UserCreate,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    user.name = data.name
    user.employee_code = data.employee_code
    user.email = data.email
    user.location = data.location
    user.role = data.role

    # Update password only if one was provided
    if data.password:
        user.password = data.password

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully"
    }

@router.get("/consumption")
def consumption(db: Session = Depends(get_db)):

    today = date.today()
    rows = (
        db.query(
            User.id,
            User.name,
            User.employee_code,
            Order.location,

            func.sum(
                case(
                    (
                        Order.beverage == "tea",
                        Order.quantity
                    ),
                    else_=0
                )
            ).label("tea"),

            func.sum(
                case(
                    (
                        Order.beverage == "coffee",
                        Order.quantity
                    ),
                    else_=0
                )
            ).label("coffee")
        )

        .join(Order,Order.user_id == User.id)
        .filter(Order.order_date == today)
        .group_by(User.id,User.name,User.employee_code,Order.location)
        .order_by(User.name)
        .all()
    )

    result = []

    for r in rows:

        tea = r.tea or 0
        coffee = r.coffee or 0

        result.append({
            "id": r.id,
            "user": r.name,
            "emp_code": r.employee_code,
            "location": r.location,
            "tea": tea,
            "coffee": coffee,
            "total": tea + coffee
        })

    return result




