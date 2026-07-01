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

@router.put(
    "/reset-password"
)
def reset_password(

    email: str,

    old: str,

    new: str,

    db: Session =
    Depends(
        get_db
    )

):

    u = (

        db.query(
            User
        )

        .filter(

            User.email ==
            email

        )

        .first()

    )


    if not u:

        raise HTTPException(

            status_code=404,

            detail=
            "User not found"

        )


    if u.password != old:

        raise HTTPException(

            status_code=401,

            detail=
            "Old password incorrect"

        )


    u.password = new


    db.commit()


    db.refresh(
        u
    )


    return {

        "message":
        "Password updated"

    }
