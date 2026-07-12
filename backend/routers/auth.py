from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.dependencies import require_roles
from models.user import User, UserRole
from db.database import get_db
from schemas.user import Token, UserCreate, UserLogin, UserResponse
from services.auth import authenticate_user, register_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user: UserCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    return register_user(user, db)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
):
    return authenticate_user(credentials, db)
