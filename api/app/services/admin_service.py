from app.core.security import hash_password
from app.models.user import User

class AdminService:
    def __init__(self, users, audit):
        self.users = users
        self.audit = audit

    def create_user(self, payload, admin):
        user = User(
            login=payload.login,
            password_hash=hash_password(payload.password),
            role=payload.role,
            is_active=True,
        )
        self.users.create(user)
        self.audit.log("ADMIN_CREATE_USER", admin.id, entity="user")
        return user
