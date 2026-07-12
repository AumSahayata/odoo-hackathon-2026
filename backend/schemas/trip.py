from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from models.trip import TripStatus


class TripCreate(BaseModel):
    vehicle_id: UUID
    driver_id: UUID
    origin: str = Field(min_length=2, max_length=100)
    destination: str = Field(min_length=2, max_length=100)
    cargo_weight: int = Field(gt=0)
    planned_distance: int = Field(gt=0)
    departure_time: datetime


class TripComplete(BaseModel):
    odometer_reading: int = Field(gt=0)


class TripResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    vehicle_id: UUID
    driver_id: UUID
    origin: str
    destination: str
    cargo_weight: int
    planned_distance: int
    actual_distance: int | None
    departure_time: datetime | None
    arrival_time: datetime | None
    status: TripStatus
