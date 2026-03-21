from fastapi import HTTPException, Depends, Header
from config.database import db
from utils.jwt_utils import verify_token
from bson import ObjectId
from typing import Optional
import sys

async def get_current_user(authorization: Optional[str] = Header(None)):
    print(f"\n=== AUTHENTICATION DEBUG ===", file=sys.stderr)
    print(f"Authorization header: {authorization}", file=sys.stderr)
    print(f"Authorization type: {type(authorization)}", file=sys.stderr)
    
    if not authorization:
        print("ERROR: No authorization header provided", file=sys.stderr)
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    # Handle "Bearer <token>" format
    if authorization.startswith("Bearer "):
        token = authorization[7:]  # Remove "Bearer " prefix
    else:
        token = authorization
    
    print(f"Token to verify (first 30 chars): {token[:30]}...", file=sys.stderr)
    
    user_id = verify_token(token)
    print(f"User ID extracted from token: {user_id}", file=sys.stderr)
    
    if not user_id:
        print("ERROR: Token verification failed - user_id is None", file=sys.stderr)
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        print(f"Looking up user with ID: {user_id}", file=sys.stderr)
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            print(f"ERROR: User not found in database", file=sys.stderr)
            raise HTTPException(status_code=401, detail="User not found")
        print(f"✓ User authenticated: {user.get('email', 'unknown')}", file=sys.stderr)
        print(f"=== AUTHENTICATION SUCCESSFUL ===\n", file=sys.stderr)
        return user
    except ObjectId as e:
        print(f"ERROR: Invalid ObjectId format: {e}", file=sys.stderr)
        raise HTTPException(status_code=401, detail="Authentication failed")
    except Exception as e:
        print(f"ERROR: Authentication exception: {e}", file=sys.stderr)
        raise HTTPException(status_code=401, detail="Authentication failed")