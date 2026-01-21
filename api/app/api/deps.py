from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import decode_token
from app.models.user import User, UserRole

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(...)):
    try:
        payload = decode_token(token)
    except:
        raise HTTPException(401)

    return payload

def require_role(*roles):
    def dep(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(403)
        return user
    return dep
