from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum
import uuid

class UserRole(str, enum.Enum):
    MAGAZYNIER = "MAGAZYNIER"
    KIEROWNIK = "KIEROWNIK"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    login: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    password_hash: Mapped[str]
    role: Mapped[UserRole]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
