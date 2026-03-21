from fastapi import HTTPException
from config.database import db
from passlib.context import CryptContext
from models.user import UserCreate
from utils.jwt_utils import create_access_token
from bson import ObjectId
import sys

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def register_user(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "password": hashed
    }
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    print(f"New user registered: {user.email} (ID: {user_id})", file=sys.stderr)
    
    token = create_access_token({"sub": user_id})
    print(f"Token created for {user.email}: {token[:50]}...", file=sys.stderr)
    
    return {"id": user_id, "email": user.email, "token": token}

async def login_user(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        print(f"Login failed for {email}: Invalid credentials", file=sys.stderr)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    print(f"Login successful for {email} (ID: {user_id})", file=sys.stderr)
    
    token = create_access_token({"sub": user_id})
    print(f"Token created for {email}: {token[:50]}...", file=sys.stderr)
    
    return {"id": user_id, "email": user["email"], "token": token}