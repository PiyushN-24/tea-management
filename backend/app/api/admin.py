from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session
from sqlalchemy import func, case

import pandas as pd

from app.db.session import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.user import UserCreate


router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


@router.get("/summary")
def summary(
    db: Session = Depends(get_db)
):

    tea = (
        db.query(
            func.sum(Order.quantity)
        )
        .filter(
            Order.beverage == "tea"
        )
        .scalar()
    )

    coffee = (
        db.query(
            func.sum(Order.quantity)
        )
        .filter(
            Order.beverage == "coffee"
        )
        .scalar()
    )

    return {
        "tea": tea or 0,
        "coffee": coffee or 0
    }


@router.get("/export")
def export(
    db: Session = Depends(get_db)
):

    orders = db.query(
        Order
    ).all()

    rows = []

    for o in orders:

        rows.append({
            "id": o.id,
            "user": o.user_id,
            "drink": o.beverage,
            "qty": o.quantity
        })

    df = pd.DataFrame(
        rows
    )

    path = "orders.csv"

    df.to_csv(
        path,
        index=False
    )

    return FileResponse(
        path,
        media_type="text/csv",
        filename="orders.csv"
    )


@router.post("/users")
def create_user(

    data: UserCreate,

    db: Session = Depends(
        get_db
    )

):

    user = User(

        name=data.name,

        email=data.email,

        password=data.password,

        role=data.role

    )

    db.add(user)

    db.commit()

    return {

        "message":
        "user created"

    }


@router.get("/consumption")
def consumption(

    db: Session = Depends(
        get_db
    )

):

    rows = (

        db.query(

            User.name,

            func.sum(
                case(
                    (
                        Order.beverage == "tea",
                        Order.quantity
                    ),
                    else_=0
                )
            ).label(
                "tea"
            ),

            func.sum(
                case(
                    (
                        Order.beverage == "coffee",
                        Order.quantity
                    ),
                    else_=0
                )
            ).label(
                "coffee"
            )

        )

        .join(

            Order,

            Order.user_id ==
            User.id

        )

        .group_by(
            User.name
        )

        .all()

    )

    result = []

    for r in rows:

        tea = r.tea or 0

        coffee = r.coffee or 0

        result.append({

            "user":
            r.name,

            "tea":
            tea,

            "coffee":
            coffee,

            "total":
            tea + coffee

        })

    return result
