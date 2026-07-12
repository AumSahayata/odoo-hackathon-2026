from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from models.vehicle import VehicleStatus, VehicleType


class VehicleCreate(BaseModel):
    registration_number: str = Field(min_length=3, max_length=50)
    model_name: str = Field(min_length=2, max_length=100)
    type: VehicleType
    max_load_capacity: int = Field(gt=0)
    odometer: int = Field(ge=0)
    acquisition_cost: Decimal = Field(gt=0)
    current_location: str


class VehicleUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    model_name: str | None = None
    type: VehicleType | None = None
    max_load_capacity: int | None = None
    odometer: int | None = None
    acquisition_cost: Decimal | None = None
    status: VehicleStatus | None = None
    current_location: str | None = None


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    registration_number: str
    model_name: str
    type: VehicleType
    max_load_capacity: int
    odometer: int
    acquisition_cost: Decimal
    status: VehicleStatus
    current_location: str
