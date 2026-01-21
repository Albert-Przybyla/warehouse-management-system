from fastapi import APIRouter
from app.api.v1 import auth, admin, debug

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"]
)


api_router.include_router(debug.router, prefix="/debug", tags=["debug"])
