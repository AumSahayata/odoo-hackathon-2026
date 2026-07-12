from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.maintenance import (
    Maintenance,
    MaintenanceStatus,
)
from models.vehicle import (
    Vehicle,
    VehicleStatus,
)
from schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceComplete,
)


def create_maintenance(
    maintenance: MaintenanceCreate,
    db: Session,
) -> Maintenance:

    vehicle = db.scalar(select(Vehicle).where(Vehicle.id == maintenance.vehicle_id))

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found.",
        )

    if vehicle.status == VehicleStatus.IN_SHOP:
        raise HTTPException(
            status_code=400,
            detail="Vehicle is already under maintenance.",
        )

    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=400,
            detail="Vehicle is currently on a trip and cannot be sent for maintenance.",
        )

    vehicle.status = VehicleStatus.IN_SHOP

    db_maintenance = Maintenance(
        **maintenance.model_dump(),
        status=MaintenanceStatus.SCHEDULED,
    )

    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)

    return db_maintenance


def get_maintenance_records(
    db: Session,
):
    stmt = select(Maintenance)

    return list(db.scalars(stmt).all())


def get_maintenance(
    maintenance_id: UUID,
    db: Session,
) -> Maintenance:

    maintenance = db.scalar(select(Maintenance).where(Maintenance.id == maintenance_id))

    if maintenance is None:
        raise HTTPException(
            status_code=404,
            detail="Maintenance record not found.",
        )

    return maintenance


def complete_maintenance(
    maintenance_id: UUID,
    data: MaintenanceComplete,
    db: Session,
) -> Maintenance:

    maintenance = get_maintenance(
        maintenance_id,
        db,
    )

    if maintenance.status == MaintenanceStatus.COMPLETED:
        raise HTTPException(
            status_code=400,
            detail="Maintenance already completed.",
        )

    vehicle = maintenance.vehicle

    vehicle.status = VehicleStatus.AVAILABLE

    maintenance.status = MaintenanceStatus.COMPLETED
    maintenance.completed_date = data.completed_date

    db.commit()
    db.refresh(maintenance)

    return maintenance
