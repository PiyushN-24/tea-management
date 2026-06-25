from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine

# load models before create_all
import app.models.user
import app.models.order

from app.api.auth import router as auth_router
from app.api.orders import router as orders_router
from app.api.admin import router as admin_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tea Management"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(orders_router)
app.include_router(admin_router)


@app.get("/")
def root():

    return {
        "status": "running"
    }
