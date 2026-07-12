from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from core.dependencies import require_roles
from db.database import get_db
from models.user import User, UserRole
from services.reports import export_vehicles_excel

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

