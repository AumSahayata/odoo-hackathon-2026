from fastapi import APIRouter

from routers.auth import router as auth_router
from routers.driver import router as driver_router
from routers.vehicle import router as vehicle_router
from routers.trip import router as trip_router
from routers.maintenance import router as maintenance_router
from routers.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(driver_router)
api_router.include_router(vehicle_router)
api_router.include_router(maintenance_router)
api_router.include_router(trip_router)
api_router.include_router(dashboard_router)