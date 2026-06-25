from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.session import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate


router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)


@router.post("/")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db)
):

    today = date.today()

    exists = (
        db.query(Order)
        .filter(
            Order.user_id == data.user_id,
            Order.order_date == today
        )
        .first()
    )

    if exists:

        raise HTTPException(
            status_code=400,
            detail="You already ordered today"
        )

    order = Order(
        user_id=data.user_id,
        beverage=data.beverage,
        quantity=data.quantity,
        order_date=today
    )

    db.add(order)

    db.commit()

    return {
        "message": "order created"
    }


@router.get("/me")
def my_orders(
    user_id: int,
    db: Session = Depends(get_db)
):

    orders = (
        db.query(Order)
        .filter(
            Order.user_id == user_id
        )
        .all()
    )

    return orders
