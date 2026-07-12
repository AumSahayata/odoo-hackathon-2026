from sqlalchemy import Boolean, Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum
from db.base_model import BaseModel


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    FLEET_MANAGER = "FLEET_MANAGER"
    SAFETY_OFFICER = "SAFETY_OFFICER"
    FINANCIAL_ANALYST = "FINANCIAL_ANALYST"


class User(BaseModel):
    __tablename__ = "users"
    
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )

    password_hash: Mapped[str] = mapped_column(String, nullable=False)

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role"), nullable=False
    )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
