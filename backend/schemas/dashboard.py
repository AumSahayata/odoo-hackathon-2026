from decimal import Decimal

from pydantic import BaseModel


class VehicleStats(BaseModel):
    total: int
    available: int
    on_trip: int
    in_shop: int


class DriverStats(BaseModel):
    total: int
    available: int
    on_trip: int
    suspended: int


class TripStats(BaseModel):
    total: int
    active: int
    completed: int
    cancelled: int


class DashboardResponse(BaseModel):
    vehicles: VehicleStats
    drivers: DriverStats
    trips: TripStats
    fleet_health: int
    alerts: list[str]
