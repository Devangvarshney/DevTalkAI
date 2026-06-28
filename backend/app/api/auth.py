import os
import datetime
import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, Header, Depends, status
from pydantic import BaseModel, EmailStr
from app.core.database import get_db

router = APIRouter()
db = get_db()

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-for-english-speak-app-123456")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def generate_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    users_col = db["users"]
    
    # Normalize email to lowercase
    email = req.email.lower()
    
    # Check if user already exists
    existing_user = users_col.find_one({"email": email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Hash the password
    password_bytes = req.password.encode('utf-8')
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Create the user document
    new_user = {
        "name": req.name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.datetime.utcnow()
    }
    
    users_col.insert_one(new_user)
    
    # Generate token
    token = generate_token(email)
    
    return {
        "token": token,
        "user": {
            "name": req.name,
            "email": email
        }
    }

@router.post("/login")
def login(req: LoginRequest):
    users_col = db["users"]
    email = req.email.lower()
    
    # Find user by email
    user = users_col.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check password
    password_bytes = req.password.encode('utf-8')
    hash_bytes = user["password_hash"].encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hash_bytes):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate token
    token = generate_token(email)
    
    return {
        "token": token,
        "user": {
            "name": user["name"],
            "email": email
        }
    }

# Dependency helper to protect routes and fetch the current user
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header"
        )
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token scheme. Use Bearer"
            )
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        users_col = db["users"]
        user = users_col.find_one({"email": email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
