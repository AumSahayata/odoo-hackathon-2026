from datetime import date, datetime, UTC
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.driver import Driver, DriverStatus
from models.trip import Trip, TripStatus
from models.vehicle import Vehicle, VehicleStatus
from schemas.trip import TripCreate, TripComplete


def create_trip(
    trip: TripCreate,
    db: Session,
) -> Trip:

    vehicle = db.scalar(select(Vehicle).where(Vehicle.id == trip.vehicle_id))

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    driver = db.scalar(select(Driver).where(Driver.id == trip.driver_id))

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found",
        )

    if vehicle.status != VehicleStatus.AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail="Vehicle is not available",
        )

    if driver.status != DriverStatus.AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail="Driver is not available",
        )

    if driver.license_expiry_date < date.today():
        raise HTTPException(
            status_code=400,
            detail="Driver license has expired",
        )

    if trip.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(
            status_code=400,
            detail="Cargo exceeds vehicle capacity",
        )

    db_trip = Trip(
        **trip.model_dump(),
        status=TripStatus.DRAFT,
    )

    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)

    return db_trip


def get_trips(db: Session):
    return list(db.scalars(select(Trip)).all())


def get_trip(
    trip_id: UUID,
    db: Session,
):
    trip = db.scalar(select(Trip).where(Trip.id == trip_id))

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return trip


def dispatch_trip(
    trip_id: UUID,
    db: Session,
):
    trip = get_trip(trip_id, db)

    if trip.status != TripStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Trip cannot be dispatched",
        )

    vehicle = trip.vehicle
    driver = trip.driver

    if vehicle.status != VehicleStatus.AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail="Vehicle not available",
        )

    if driver.status != DriverStatus.AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail="Driver not available",
        )

    vehicle.status = VehicleStatus.ON_TRIP
    driver.status = DriverStatus.ON_TRIP

    trip.status = TripStatus.DISPATCHED
    trip.departure_time = datetime.now(UTC)

    db.commit()
    db.refresh(trip)

    return trip


def complete_trip(
    trip_id: UUID,
    data: TripComplete,
    db: Session,
):
    trip = get_trip(trip_id, db)

    if trip.status != TripStatus.DISPATCHED:
        raise HTTPException(
            status_code=400,
            detail="Trip is not active",
        )

    vehicle = trip.vehicle
    driver = trip.driver

    vehicle.status = VehicleStatus.AVAILABLE
    driver.status = DriverStatus.AVAILABLE

    actual_distance = data.odometer_reading - vehicle.odometer

    vehicle.odometer = data.odometer_reading

    trip.actual_distance = actual_distance
    trip.arrival_time = datetime.now(UTC)
    trip.status = TripStatus.COMPLETED

    db.commit()
    db.refresh(trip)

    return trip


def cancel_trip(
    trip_id: UUID,
    db: Session,
):
    trip = get_trip(trip_id, db)

    if trip.status == TripStatus.DISPATCHED:
        trip.vehicle.status = VehicleStatus.AVAILABLE
        trip.driver.status = DriverStatus.AVAILABLE

    trip.status = TripStatus.CANCELLED

    db.commit()
