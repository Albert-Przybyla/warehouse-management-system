from pydantic import BaseModel
from app.models.user import UserRole
import uuid

class UserCreate(BaseModel):
    login: str
    password: str
    role: UserRole

class UserOut(BaseModel):
    id: uuid.UUID
    login: str
    role: UserRole
    is_active: bool
