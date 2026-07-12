from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, DateTime
from datetime import datetime

from models.driver import Driver
from models.vehicle import Vehicle
from db.base_model import BaseModel


class TripStatus(str, Enum):
    DRAFT = "DRAFT"
    DISPATCHED = "DISPATCHED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Trip(BaseModel):
    __tablename__ = "trips"

    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    driver_id: Mapped[int] = mapped_column(ForeignKey("drivers.id"), nullable=False)

    origin: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)

    cargo_weight: Mapped[int] = mapped_column(Integer, nullable=False)
    planned_distance: Mapped[int] = mapped_column(Integer, nullable=False)
    actual_distance: Mapped[int] = mapped_column(Integer, nullable=True)

    departure_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    arrival_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    status: Mapped[str] = mapped_column(String(50), nullable=False)

    vehicle: Mapped["Vehicle"] = relationship(back_populates="trips")
    driver: Mapped["Driver"] = relationship(back_populates="trips")