from core.dependencies import get_admin_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session  
from database import get_db
from schemas.user import UserOut
from models.user import User
router = APIRouter(prefix="/admin", tags=["Admin"])
@router.get("/users",response_model=list[UserOut])
def get_all_users(admin_user:User=Depends(get_admin_user),db:Session=Depends(get_db)):
    users=db.query(User).all()
    return users



