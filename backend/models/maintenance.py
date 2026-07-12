from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Enum as SQLEnum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from enum import Enum

from db.base_model import BaseModel


class MaintenanceStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class MaintenanceType(str, Enum):
    PREVENTIVE = "PREVENTIVE"
    CORRECTIVE = "CORRECTIVE"
    INSPECTION = "INSPECTION"
    OIL_CHANGE = "OIL_CHANGE"
    TIRE_CHANGE = "TIRE_CHANGE"


class Maintenance(BaseModel):
    __tablename__ = "maintenance"

    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False)

    maintenance_type: Mapped[MaintenanceType] = mapped_column(
        SQLEnum(MaintenanceType, name="maintenance_type"),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    cost: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    scheduled_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    completed_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[MaintenanceStatus] = mapped_column(
        SQLEnum(MaintenanceStatus, name="maintenance_status"),
        default=MaintenanceStatus.SCHEDULED,
        nullable=False,
    )
    
    vehicle: Mapped["Vehicle"] = relationship(back_populates="maintenance")

    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_records",
    )
