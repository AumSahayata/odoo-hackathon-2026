from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models.driver import Driver, DriverStatus
from models.maintenance import Maintenance
from models.trip import Trip, TripStatus
from models.vehicle import Vehicle, VehicleStatus
from schemas.dashboard import (
    DashboardResponse,
    DriverStats,
    TripStats,
    VehicleStats,
)


def get_stats(db: Session):
    vehicle_total = db.scalar(select(func.count()).select_from(Vehicle)) or 0

    vehicle_available = (
        db.scalar(select(func.count()).where(Vehicle.status == VehicleStatus.AVAILABLE))
        or 0
    )

    vehicle_trip = (
        db.scalar(select(func.count()).where(Vehicle.status == VehicleStatus.ON_TRIP))
        or 0
    )

    vehicle_shop = (
        db.scalar(select(func.count()).where(Vehicle.status == VehicleStatus.IN_SHOP))
        or 0
    )

    driver_total = db.scalar(select(func.count()).select_from(Driver)) or 0

    driver_available = (
        db.scalar(select(func.count()).where(Driver.status == DriverStatus.AVAILABLE))
        or 0
    )

    driver_trip = (
        db.scalar(select(func.count()).where(Driver.status == DriverStatus.ON_TRIP))
        or 0
    )

    driver_suspended = (
        db.scalar(select(func.count()).where(Driver.status == DriverStatus.SUSPENDED))
        or 0
    )

    driver_offduty = (
        db.scalar(select(func.count()).where(Driver.status == DriverStatus.OFF_DUTY))
        or 0
    )

    trip_total = db.scalar(select(func.count()).select_from(Trip)) or 0

    trip_active = (
        db.scalar(select(func.count()).where(Trip.status == TripStatus.DISPATCHED)) or 0
    )

    trip_completed = (
        db.scalar(select(func.count()).where(Trip.status == TripStatus.COMPLETED)) or 0
    )

    trip_cancelled = (
        db.scalar(select(func.count()).where(Trip.status == TripStatus.CANCELLED)) or 0
    )

    fleet_score = fleet_health(driver_suspended, trip_cancelled, vehicle_shop)

    alerts = get_alerts(driver_suspended, trip_active, vehicle_shop)

    return DashboardResponse(
        vehicles=VehicleStats(
            total=vehicle_total,
            available=vehicle_available,
            on_trip=vehicle_trip,
            in_shop=vehicle_shop,
        ),
        drivers=DriverStats(
            total=driver_total,
            available=driver_available,
            on_trip=driver_trip,
            suspended=driver_suspended,
        ),
        trips=TripStats(
            total=trip_total,
            active=trip_active,
            completed=trip_completed,
            cancelled=trip_cancelled,
        ),
        fleet_health=fleet_score,
        alerts=alerts,
    )


def fleet_health(vehicle_shop: int, driver_suspended: int, trip_cancelled: int) -> int:
    score = 100

    score -= vehicle_shop * 10

    score -= driver_suspended * 5

    score -= trip_cancelled * 2

    score = max(0, score)

    return score


def get_alerts(vehicle_shop: int, driver_suspended: int, trip_active: int):
    alerts = []

    if vehicle_shop > 0:
        alerts.append(
            {
                "severity": "HIGH",
                "title": "Maintenance",
                "message": f"{vehicle_shop} vehicle(s) currently under maintenance.",
            }
        )

    if driver_suspended > 0:
        alerts.append(
            {
                "severity": "HIGH",
                "title": "Driver Suspended",
                "message": f"{driver_suspended} suspended driver(s).",
            }
        )

    if trip_active > 5:
        alerts.append(
            {
                "severity": "INFO",
                "title": "High Activity",
                "message": f"{trip_active} trips are currently active.",
            }
        )

    return alerts
