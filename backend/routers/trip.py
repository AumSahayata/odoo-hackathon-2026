from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.dependencies import get_current_user, require_roles
from db.database import get_db
from models.user import User, UserRole
from schemas.trip import TripComplete, TripCreate, TripResponse
from services.trip import cancel_trip, complete_trip, create_trip, dispatch_trip, get_trips

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
)


@router.post(
    "",
    response_model=TripResponse,
    status_code=201,
)
def create(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    return create_trip(trip, db)


@router.get(
    "",
    response_model=list[TripResponse],
)
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trips(db)


@router.post(
    "/{trip_id}/dispatch",
    response_model=TripResponse,
)
def dispatch(
    trip_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    return dispatch_trip(trip_id, db)


@router.post(
    "/{trip_id}/complete",
    response_model=TripResponse,
)
def complete(
    trip_id: UUID,
    data: TripComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    return complete_trip(trip_id, data, db)


@router.post("/{trip_id}/cancel")
def cancel(
    trip_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.FLEET_MANAGER,
        )
    ),
):
    cancel_trip(trip_id, db)
    return {"message": "Trip cancelled successfully"}