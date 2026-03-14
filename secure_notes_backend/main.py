from fastapi import FastAPI
from database import engine, Base
from models.user import User
from fastapi import Depends
from models import notes,user
from routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app=FastAPI(title="Secure notes app backend")
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
Base.metadata.create_all(bind=engine)
@app.get("/health")
def health():
    return{
        "status":"Backend functioning properly"
    }

from core.dependencies import get_current_user

@app.get("/me")
def read_me(current_user: User=Depends(get_current_user)):
    return{
        "username":current_user.username,
        "email":current_user.email,
        "is_admin":current_user.is_admin
    }

from models.notes import Note

from routes.notes import router as notes_router

app.include_router(notes_router)

from routes.admin import router as admin_router

app.include_router(admin_router)
