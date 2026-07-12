from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.driver import Driver, DriverStatus
from schemas.driver import DriverCreate, DriverUpdate


def create_driver(
    driver: DriverCreate,
    db: Session,
) -> Driver:

    stmt = select(Driver).where(Driver.license_number == driver.license_number)

    existing = db.scalar(stmt)

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Driver with this license already exists.",
        )

    db_driver = Driver(**driver.model_dump())

    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)

    return db_driver


def get_drivers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> list[Driver]:

    stmt = select(Driver).offset(skip).limit(limit)

    return list(db.scalars(stmt))


def get_driver(
    driver_id: UUID,
    db: Session,
) -> Driver:

    stmt = select(Driver).where(Driver.id == driver_id)

    driver = db.scalar(stmt)

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found.",
        )

    return driver


def update_driver(
    driver_id: UUID,
    driver_update: DriverUpdate,
    db: Session,
) -> Driver:

    driver = get_driver(driver_id, db)

    update_data = driver_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(driver, key, value)

    db.commit()
    db.refresh(driver)

    return driver


def delete_driver(
    driver_id: UUID,
    db: Session,
) -> None:

    driver = get_driver(driver_id, db)

    driver.status = DriverStatus.OFF_DUTY

    db.commit()
