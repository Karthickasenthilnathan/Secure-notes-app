from database import Base
from sqlalchemy import Column,String,Boolean,Integer

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,nullable=False,unique=True,index=True)
    username=Column(String,unique=True,nullable=False,index=True)
    hashed_password=Column(String,nullable=False)
    is_admin=Column(Boolean,default=False)