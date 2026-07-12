from decimal import Decimal

from db.base_model import BaseModel
from sqlalchemy import Integer, Numeric, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from enum import Enum


class VehicleStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    ON_TRIP = "ON_TRIP"
    IN_SHOP = "IN_SHOP"
    RETIRED = "RETIRED"


class VehicleType(str, Enum):
    TRUCK = "TRUCK"
    VAN = "VAN"
    CAR = "CAR"
    MOTORCYCLE = "MOTORCYCLE"


class Vehicle(BaseModel):
    __tablename__ = "vehicles"

    registration_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    model_name: Mapped[str] = mapped_column(String(100), nullable=False)

    type: Mapped[VehicleType] = mapped_column(
        SQLEnum(VehicleType, name="vehicle_type"),
        nullable=False,
    )
    max_load_capacity: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    odometer: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    acquisition_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    status: Mapped[VehicleStatus] = mapped_column(
        SQLEnum(VehicleStatus, name="vehicle_status"),
        nullable=False,
        default=VehicleStatus.AVAILABLE,
    )

    current_location: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    trips: Mapped[list["Trip"]] = relationship(back_populates="vehicle")