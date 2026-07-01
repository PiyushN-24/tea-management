from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import func

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

    used = (

        db.query(
            func.sum(
                Order.quantity
            )
        )

        .filter(
            Order.user_id ==
            data.user_id
        )

        .filter(
            Order.order_date ==
            today
        )

        .scalar()

        or 0

    )

    if used + data.quantity > 2:

        raise HTTPException(

            status_code=400,

            detail=
            "Daily limit exceeded (max 2 cups)"

        )

    order = Order(

        user_id=
        data.user_id,

        beverage=
        data.beverage,

        quantity=
        data.quantity,

        order_date=
        today

    )

    db.add(order)

    db.commit()

    db.refresh(order)

    return {

        "message":
        "Order submitted",

        "remaining":
        2 - (
            used +
            data.quantity
        )

    }


@router.get("/me")
def my_orders(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (

        db.query(
            Order
        )

        .filter(
            Order.user_id ==
            user_id
        )

        .order_by(
            Order.order_date.desc()
        )

        .all()

    )
