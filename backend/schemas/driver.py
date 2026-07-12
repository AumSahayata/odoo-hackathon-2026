from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from models.driver import DriverStatus, LicenseCategory

class DriverCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    license_number: str
    license_category: LicenseCategory
    license_expiry_date: date
    contact_number: str
    safety_score: Decimal = Field(default=Decimal(100))


class DriverUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str | None = None
    license_category: LicenseCategory | None = None
    license_expiry_date: date | None = None
    contact_number: str | None = None
    safety_score: Decimal | None = None
    status: DriverStatus | None = None


class DriverResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    license_number: str
    license_category: LicenseCategory
    license_expiry_date: date
    contact_number: str
    safety_score: Decimal
    status: DriverStatus