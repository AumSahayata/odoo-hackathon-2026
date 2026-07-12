from fastapi import APIRouter

from routers.auth import router as auth_router
from routers.driver import router as driver_router
from routers.vehicle import router as vehicles_router
from routers.trip import router as trip_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(driver_router)
api_router.include_router(vehicles_router)
api_router.include_router(trip_router)