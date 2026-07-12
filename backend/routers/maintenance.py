from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.dependencies import (
    get_current_user,
    require_roles,
)
from db.database import get_db
from models.user import User, UserRole
from schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceComplete,
    MaintenanceResponse,
)
from services.maintenance import (
    create_maintenance,
    get_maintenance,
    get_maintenance_records,
    complete_maintenance,
)

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"],
)


@router.post(
    "",
    response_model=MaintenanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    maintenance: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.SAFETY_OFFICER,
        )
    ),
):
    return create_maintenance(
        maintenance,
        db,
    )


@router.get(
    "",
    response_model=list[MaintenanceResponse],
)
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_maintenance_records(db)


@router.get(
    "/{maintenance_id}",
    response_model=MaintenanceResponse,
)
def get(
    maintenance_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_maintenance(
        maintenance_id,
        db,
    )


@router.post(
    "/{maintenance_id}/complete",
    response_model=MaintenanceResponse,
)
def complete(
    maintenance_id: UUID,
    data: MaintenanceComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.SAFETY_OFFICER,
        )
    ),
):
    return complete_maintenance(
        maintenance_id,
        data,
        db,
    )
