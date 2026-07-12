from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.user import User
from schemas.user import UserCreate, UserLogin
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


def register_user(
    user: UserCreate,
    db: Session,
):
    stmt = select(User).where(User.email == user.email)
    existing = db.scalar(stmt)

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(
    credentials: UserLogin,
    db: Session,
):
    stmt = select(User).where(User.email == credentials.email)
    user = db.scalar(stmt)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is disabled",
        )

    if not verify_password(
        credentials.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
    }
