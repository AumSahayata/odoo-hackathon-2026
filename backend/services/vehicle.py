from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from models.vehicle import Vehicle, VehicleStatus
from schemas.vehicle import VehicleCreate, VehicleUpdate


def create_vehicle(
    vehicle: VehicleCreate,
    db: Session,
) -> Vehicle:

    stmt = select(Vehicle).where(
        Vehicle.registration_number == vehicle.registration_number
    )

    existing = db.scalar(stmt)

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Vehicle with this registration number already exists.",
        )

    db_vehicle = Vehicle(**vehicle.model_dump())

    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle


def get_vehicles(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> list[Vehicle]:

    stmt = select(Vehicle).offset(skip).limit(limit)

    return list(db.scalars(stmt))


def get_vehicle(
    vehicle_id: UUID,
    db: Session,
) -> Vehicle:

    stmt = select(Vehicle).where(Vehicle.id == vehicle_id)

    vehicle = db.scalar(stmt)

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found.",
        )

    return vehicle


def update_vehicle(
    vehicle_id: UUID,
    vehicle_update: VehicleUpdate,
    db: Session,
) -> Vehicle:

    vehicle = get_vehicle(vehicle_id, db)

    update_data = vehicle_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(vehicle, key, value)

    db.commit()
    db.refresh(vehicle)

    return vehicle


def delete_vehicle(
    vehicle_id: UUID,
    db: Session,
) -> None:

    vehicle = get_vehicle(vehicle_id, db)

    vehicle.status = VehicleStatus.RETIRED

    db.commit()
