from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Login


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/login")
def login(
    data: Login,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="invalid credentials"
        )

    if user.password != data.password:

        raise HTTPException(
            status_code=401,
            detail="invalid credentials"
        )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }
