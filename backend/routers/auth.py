from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.dependencies import get_current_user, require_roles
from models.user import User, UserRole
from db.database import get_db
from schemas.user import Me, Token, UserCreate, UserLogin, UserResponse
from services.auth import authenticate_user, get_me, register_user

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


@router.get(
    "/me",
    response_model=Me
)
def get_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    
    return get_me(current_user, db)