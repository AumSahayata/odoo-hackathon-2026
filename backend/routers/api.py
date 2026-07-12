from fastapi import APIRouter

from routers.auth import router as auth_router
from routers.vehicle import router as vehicles_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(vehicles_router)