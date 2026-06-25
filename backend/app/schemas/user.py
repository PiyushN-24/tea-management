from pydantic import BaseModel


class Login(BaseModel):

    email: str

    password: str


class UserCreate(BaseModel):

    name: str

    email: str

    password: str

    role: str = "user"
