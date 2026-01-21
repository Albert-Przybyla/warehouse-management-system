from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_login(self, login: str):
        return self.db.query(User).filter_by(login=login).first()

    def list(self):
        return self.db.query(User).all()

    def create(self, user: User):
        self.db.add(user)
