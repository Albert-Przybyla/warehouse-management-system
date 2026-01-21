from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, **data):
        self.db.add(AuditLog(**data))
