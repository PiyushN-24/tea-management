from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.db.base import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    beverage = Column(
        String,
        nullable=False
    )

    quantity = Column(
        Integer,
        default=1
    )

    order_date = Column(
        Date
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
