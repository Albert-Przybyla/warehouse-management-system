from passlib.context import CryptContext

pwd_ctx = CryptContext(schemes=["bcrypt"])

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(password: str, hash: str) -> bool:
    return pwd_ctx.verify(password, hash)
