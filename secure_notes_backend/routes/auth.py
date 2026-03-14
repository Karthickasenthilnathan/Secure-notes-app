from models.user import User
from schemas.user import UserCreate, UserOut
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.security import hash_password
router=APIRouter(prefix="/auth",tags=["Auth"])


from core.security import verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm


@router.post("/register",response_model=UserOut)
def register_user(user:UserCreate,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter((User.username==user.username) | (User.email==user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            details="User already exists"
        )
    new_user=User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/login",response_model=Token)
def login(
    form_data:OAuth2PasswordRequestForm=Depends(),
    db:Session=Depends(get_db)
):
    user=db.query(User).filter(User.username==form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    access_token=create_access_token(data={"sub":user.username})
    return {
        "access_token":access_token,
        "token_type":"bearer"
        }   