from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from models.maintenance import MaintenanceStatus, MaintenanceType


class MaintenanceCreate(BaseModel):
    vehicle_id: UUID
    maintenance_type: MaintenanceType
    description: str
    cost: Decimal
    scheduled_date: date


class MaintenanceComplete(BaseModel):
    completed_date: date


class MaintenanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    vehicle_id: UUID
    maintenance_type: MaintenanceType
    description: str
    cost: Decimal
    scheduled_date: date
    completed_date: date | None
    status: MaintenanceStatus