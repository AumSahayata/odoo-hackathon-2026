from datetime import date
from decimal import Decimal
from enum import Enum
from models.vehicle import Vehicle
from db.base_model import BaseModel

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, Numeric, String, Enum as SQLEnum


class DriverStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    ON_TRIP = "ON_TRIP"
    OFF_DUTY = "OFF_DUTY"
    SUSPENDED = "SUSPENDED"


class LicenseCategory(str, Enum):
    MCWOG = "MCWOG"
    MCWG = "MCWG"
    LMVNT = "LMV-NT"
    LMVTR = "LMV-TR"
    HMV = "HMV"


class Driver(BaseModel):
    __tablename__ = "drivers"

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    license_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    license_category: Mapped[LicenseCategory] = mapped_column(
        SQLEnum(LicenseCategory, name="license_category"),
        nullable=False,
    )

    license_expiry_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    contact_number: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    safety_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=100,
        nullable=False,
    )

    status: Mapped[DriverStatus] = mapped_column(
        SQLEnum(DriverStatus, name="driver_status"),
        default=DriverStatus.AVAILABLE,
        nullable=False,
    )
    
    trips: Mapped[list["Trip"]] = relationship(back_populates="driver")
