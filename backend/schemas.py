from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class TokenData(BaseModel):
    email: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str  # This will be returned from the backend
    email: EmailStr

    class Config:
        orm_mode = True


class UserPreferenceBase(BaseModel):
    theme: str = "light"
    notifications: bool = True

class UserPreference(UserPreferenceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class ClimateMetrics(BaseModel):
    averageTemperature: float
    precipitation: float
    seasons: List[str]

class CostMetrics(BaseModel):
    housing: float
    food: float
    transportation: float
    entertainment: float
    costOfLivingIndex: float

class InfrastructureMetrics(BaseModel):
    averageWifiSpeed: float
    coworkingSpaces: int

class QualityOfLifeMetrics(BaseModel):
    healthcareIndex: float
    safetyIndex: float
    pollutionIndex: float

class DigitalNomadMetrics(BaseModel):
    communitySize: int
    monthlyMeetups: int
    visaRequirements: str

class Coordinates(BaseModel):
    lat: float
    lng: float

class Metrics(BaseModel):
    climate: ClimateMetrics
    cost: CostMetrics
    infrastructure: InfrastructureMetrics
    qualityOfLife: QualityOfLifeMetrics
    digitalNomad: DigitalNomadMetrics

class City(BaseModel):
    id: str
    name: str
    country: str
    coordinates: Dict[str, float]
    metrics: Dict[str, Any]

class TravelPlanBase(BaseModel):
    cities: List[str]
    date_range: Dict
    transportation: List[Dict]
    accommodation: List[Dict]
    budget: Dict

class TravelPlanCreate(TravelPlanBase):
    pass

class TravelPlan(TravelPlanBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# City filter schemas
class TemperatureRange(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None

class CostFilters(BaseModel):
    maxTotal: Optional[int] = None
    maxHousing: Optional[int] = None
    maxFood: Optional[int] = None
    maxTransportation: Optional[int] = None
    maxEntertainment: Optional[int] = None

class QualityOfLifeFilters(BaseModel):
    minHealthcare: Optional[int] = None
    minSafety: Optional[int] = None
    maxPollution: Optional[int] = None

class ClimateFilters(BaseModel):
    temperature: Optional[TemperatureRange] = None
    maxPrecipitation: Optional[int] = None
    selectedWeather: Optional[List[str]] = None
    selectedSeasons: Optional[List[str]] = None

class InfrastructureFilters(BaseModel):
    minWifiSpeed: Optional[int] = None
    minCoworkingSpaces: Optional[int] = None

class DigitalNomadFilters(BaseModel):
    minCommunitySize: Optional[int] = None
    minMonthlyMeetups: Optional[int] = None
    selectedVisas: Optional[List[str]] = None

class InternetFilters(BaseModel):
    selectedSpeeds: Optional[List[str]] = None

class CityFilters(BaseModel):
    cost: Optional[CostFilters] = None
    qualityOfLife: Optional[QualityOfLifeFilters] = None
    climate: Optional[ClimateFilters] = None
    infrastructure: Optional[InfrastructureFilters] = None
    digitalNomad: Optional[DigitalNomadFilters] = None
    internet: Optional[InternetFilters] = None