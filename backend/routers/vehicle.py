from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from services.reports import export_vehicles_excel
from core.dependencies import get_current_user, require_roles
from db.database import get_db
from models.user import User, UserRole
from services.vehicle import (
    create_vehicle,
    delete_vehicle,
    get_vehicle,
    get_vehicles,
    update_vehicle,
)
from schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.get("/excel")
def export_vehicle_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FINANCIAL_ANALYST,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    buffer = export_vehicles_excel(db)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="vehicles.xlsx"'
        },
    )


@router.post(
    "",
    response_model=VehicleResponse,
    status_code=201,
)
def create(
    vehicle: VehicleCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)),
    db: Session = Depends(get_db),
):
    return create_vehicle(vehicle, db)


@router.get(
    "",
    response_model=list[VehicleResponse],
)
def list_all(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_vehicles(db, skip, limit)


@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def get(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_vehicle(vehicle_id, db)


@router.patch(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def update(
    vehicle_id: UUID,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    return update_vehicle(
        vehicle_id,
        vehicle,
        db,
    )


from fastapi import status


@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    delete_vehicle(vehicle_id, db)
