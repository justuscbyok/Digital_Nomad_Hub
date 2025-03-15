from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default preferences
    db_preferences = models.UserPreference(user_id=db_user.id)
    db.add(db_preferences)
    db.commit()
    
    return db_user

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if not user:
        # Check if this is the demo user's first login
        if email == "demo@digitalnomad.com" and password == "demo123456":
            # Create the demo user
            user = create_user(db, schemas.UserCreate(
                email=email,
                password=password,
                full_name="Demo User"
            ))
            return user
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_user_travel_plans(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.TravelPlan)\
        .filter(models.TravelPlan.user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_user_travel_plan(db: Session, plan: schemas.TravelPlanCreate, user_id: int):
    db_plan = models.TravelPlan(**plan.model_dump(), user_id=user_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def update_user_preferences(db: Session, user_id: int, preferences: schemas.UserPreferenceBase):
    db_preferences = db.query(models.UserPreference)\
        .filter(models.UserPreference.user_id == user_id)\
        .first()
    
    if db_preferences:
        for key, value in preferences.model_dump().items():
            setattr(db_preferences, key, value)
    else:
        db_preferences = models.UserPreference(user_id=user_id, **preferences.model_dump())
        db.add(db_preferences)
    
    db.commit()
    db.refresh(db_preferences)
    return db_preferences