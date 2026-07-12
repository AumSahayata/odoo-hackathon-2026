from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas.driver import DriverCreate, DriverResponse, DriverUpdate
from core.dependencies import get_current_user, require_roles
from db.database import get_db
from models.user import User, UserRole
from services.driver import (
    create_driver,
    delete_driver,
    get_driver,
    get_drivers,
    update_driver,
)

router = APIRouter(
    prefix="/drivers",
    tags=["drivers"],
)


@router.post(
    "",
    response_model=DriverResponse,
    status_code=201,
)
def create(
    driver: DriverCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)),
    db: Session = Depends(get_db),
):
    return create_driver(driver, db)


@router.get(
    "",
    response_model=list[DriverResponse],
)
def list_all(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_drivers(db, skip, limit)


@router.get(
    "/{driver_id}",
    response_model=DriverResponse,
)
def get(
    driver_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_driver(driver_id, db)


@router.patch(
    "/{driver_id}",
    response_model=DriverResponse,
)
def update(
    driver_id: UUID,
    driver: DriverUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
            UserRole.SAFETY_OFFICER,
        )
    ),
):
    return update_driver(
        driver_id,
        driver,
        db,
    )


@router.delete(
    "/{driver_id}",
    status_code=204,
)
def delete(
    driver_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
            UserRole.SAFETY_OFFICER
        )
    ),
):
    delete_driver(driver_id, db)
