from fastapi import FastAPI, HTTPException, Depends, status, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import List, Optional
import jwt
import json
from google.cloud import bigquery
from . import schemas
from . import crud
import os

# Get the absolute path of the JSON key file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, "capstone-justus-51d7198c35df.json")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH

client = bigquery.Client()

# Initialize FastAPI app
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=False,  # Set to False for simpler CORS handling
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Security configuration
SECRET_KEY = "your-secret-key"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Load mock data
with open('backend/mock_data/cities.json', 'r') as f:
    cities_data = json.load(f)

# -----------------------
# 🔹 JWT Token Functions
# -----------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

# -----------------------
# 🔹 Authentication Routes
# -----------------------
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

# -----------------------
# 🔹 User Routes
# -----------------------
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate):
    existing_user = crud.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(user)

@app.get("/profile", response_model=schemas.User)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@app.put("/profile/preferences", response_model=schemas.UserPreference)
async def update_preferences(preferences: schemas.UserPreferenceBase, current_user: dict = Depends(get_current_user)):
    return crud.update_user_preferences(current_user["id"], preferences)

# -----------------------
# 🔹 City Routes
# -----------------------
@app.get("/cities")
async def get_cities(limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)):
    try:
        query = """
            SELECT id, name, country, lat, lng, 
                   averageTemperature, precipitation, seasons, 
                   housing, food, transportation, entertainment, costOfLivingIndex, 
                   averageWifiSpeed, coworkingSpaces, 
                   healthcareIndex, safetyIndex, pollutionIndex, 
                   communitySize, monthlyMeetups, visaRequirements
            FROM `capstone-justus.digital_nomad.cities`
            ORDER BY name
            LIMIT @limit OFFSET @offset
        """

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("limit", "INT64", limit),
                bigquery.ScalarQueryParameter("offset", "INT64", offset),
            ]
        )

        # Print the query for debugging
        print(f"Executing query: {query}")
        print(f"With parameters: {job_config.query_parameters}")

        job = client.query(query, job_config=job_config)
        results = job.result()

        cities_list = []
        for row in results:
            try:
                cities_list.append({
                    "id": row["id"],
                    "name": row["name"],
                    "country": row["country"],
                    "coordinates": {
                        "lat": float(row["lat"]) if row["lat"] and row["lat"].strip() else None,
                        "lng": float(row["lng"]) if row["lng"] and row["lng"].strip() else None
                    },
                    "metrics": {
                        "climate": {
                            "averageTemperature": int(float(row["averageTemperature"])) if row["averageTemperature"] and row["averageTemperature"].strip() else None,
                            "precipitation": int(float(row["precipitation"])) if row["precipitation"] and row["precipitation"].strip() else None,
                            "seasons": row["seasons"].split(", ") if row["seasons"] else []
                        },
                        "cost": {
                            "housing": int(float(row["housing"])) if row["housing"] and row["housing"].strip() else None,
                            "food": int(float(row["food"])) if row["food"] and row["food"].strip() else None,
                            "transportation": int(float(row["transportation"])) if row["transportation"] and row["transportation"].strip() else None,
                            "entertainment": int(float(row["entertainment"])) if row["entertainment"] and row["entertainment"].strip() else None,
                            "costOfLivingIndex": int(float(row["costOfLivingIndex"])) if row["costOfLivingIndex"] and row["costOfLivingIndex"].strip() else None
                        },
                        "infrastructure": {
                            "averageWifiSpeed": int(float(row["averageWifiSpeed"])) if row["averageWifiSpeed"] and row["averageWifiSpeed"].strip() else None,
                            "coworkingSpaces": int(float(row["coworkingSpaces"])) if row["coworkingSpaces"] and row["coworkingSpaces"].strip() else None
                        },
                        "qualityOfLife": {
                            "healthcareIndex": int(float(row["healthcareIndex"])) if row["healthcareIndex"] and row["healthcareIndex"].strip() else None,
                            "safetyIndex": int(float(row["safetyIndex"])) if row["safetyIndex"] and row["safetyIndex"].strip() else None,
                            "pollutionIndex": int(float(row["pollutionIndex"])) if row["pollutionIndex"] and row["pollutionIndex"].strip() else None
                        },
                        "digitalNomad": {
                            "communitySize": int(float(row["communitySize"])) if row["communitySize"] and row["communitySize"].strip() else None,
                            "monthlyMeetups": int(float(row["monthlyMeetups"])) if row["monthlyMeetups"] and row["monthlyMeetups"].strip() else None,
                            "visaRequirements": row["visaRequirements"]
                        }
                    }
                })
            except Exception as e:
                print(f"Error processing row {row}: {e}")
        
        return {"cities": cities_list if cities_list else []}  # Always return an array
    except Exception as e:
        print(f"Error in get_cities: {e}")
        # Fallback to mock data
        return {"cities": cities_data["cities"]}

@app.get("/cities/{city_id}", response_model=schemas.City)
async def get_city(city_id: str):
    city = next((city for city in cities_data["cities"] if city["id"] == city_id), None)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

# -----------------------
# 🔹 Travel Plan Routes
# -----------------------
@app.post("/plans", response_model=schemas.TravelPlan)
async def create_plan(plan: schemas.TravelPlanCreate, current_user: dict = Depends(get_current_user)):
    return crud.create_user_travel_plan(plan, current_user["id"])

@app.get("/plans", response_model=List[schemas.TravelPlan])
async def get_plans(current_user: dict = Depends(get_current_user), skip: int = 0, limit: int = 100):
    return crud.get_user_travel_plans(current_user["id"], skip, limit)



@app.get("/populate_cities")
async def populate_cities(limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)):
    try:
        query = """
            SELECT id, name, country, lat, lng, 
                   averageTemperature, precipitation, seasons, 
                   housing, food, transportation, entertainment, costOfLivingIndex, 
                   averageWifiSpeed, coworkingSpaces, 
                   healthcareIndex, safetyIndex, pollutionIndex, 
                   communitySize, monthlyMeetups, visaRequirements
            FROM `capstone-justus.digital_nomad.cities`
            ORDER BY name
            LIMIT @limit OFFSET @offset
        """

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("limit", "INT64", limit),
                bigquery.ScalarQueryParameter("offset", "INT64", offset),
            ]
        )

        # Print the query for debugging
        print(f"Executing query: {query}")
        print(f"With parameters: {job_config.query_parameters}")

        job = client.query(query, job_config=job_config)
        results = job.result()

        cities_list = []
        for row in results:
            try:
                cities_list.append({
                    "id": row["id"],
                    "name": row["name"],
                    "country": row["country"],
                    "coordinates": {
                        "lat": float(row["lat"]) if row["lat"] and row["lat"].strip() else None,
                        "lng": float(row["lng"]) if row["lng"] and row["lng"].strip() else None
                    },
                    "metrics": {
                        "climate": {
                            "averageTemperature": int(float(row["averageTemperature"])) if row["averageTemperature"] and row["averageTemperature"].strip() else None,
                            "precipitation": int(float(row["precipitation"])) if row["precipitation"] and row["precipitation"].strip() else None,
                            "seasons": row["seasons"].split(", ") if row["seasons"] else []
                        },
                        "cost": {
                            "housing": int(float(row["housing"])) if row["housing"] and row["housing"].strip() else None,
                            "food": int(float(row["food"])) if row["food"] and row["food"].strip() else None,
                            "transportation": int(float(row["transportation"])) if row["transportation"] and row["transportation"].strip() else None,
                            "entertainment": int(float(row["entertainment"])) if row["entertainment"] and row["entertainment"].strip() else None,
                            "costOfLivingIndex": int(float(row["costOfLivingIndex"])) if row["costOfLivingIndex"] and row["costOfLivingIndex"].strip() else None
                        },
                        "infrastructure": {
                            "averageWifiSpeed": int(float(row["averageWifiSpeed"])) if row["averageWifiSpeed"] and row["averageWifiSpeed"].strip() else None,
                            "coworkingSpaces": int(float(row["coworkingSpaces"])) if row["coworkingSpaces"] and row["coworkingSpaces"].strip() else None
                        },
                        "qualityOfLife": {
                            "healthcareIndex": int(float(row["healthcareIndex"])) if row["healthcareIndex"] and row["healthcareIndex"].strip() else None,
                            "safetyIndex": int(float(row["safetyIndex"])) if row["safetyIndex"] and row["safetyIndex"].strip() else None,
                            "pollutionIndex": int(float(row["pollutionIndex"])) if row["pollutionIndex"] and row["pollutionIndex"].strip() else None
                        },
                        "digitalNomad": {
                            "communitySize": int(float(row["communitySize"])) if row["communitySize"] and row["communitySize"].strip() else None,
                            "monthlyMeetups": int(float(row["monthlyMeetups"])) if row["monthlyMeetups"] and row["monthlyMeetups"].strip() else None,
                            "visaRequirements": row["visaRequirements"]
                        }
                    }
                })
            except Exception as e:
                print(f"Error processing row {row}: {e}")
        
        return {"cities": cities_list if cities_list else []}  # Always return an array
    except Exception as e:
        print(f"Error in populate_cities: {e}")
        # Fallback to mock data
        return {"cities": cities_data["cities"]}

@app.get("/filter_cities")
async def filter_cities(
    min_temp: Optional[str] = None,  # Keep it as STRING
    max_temp: Optional[str] = None,
    max_cost: Optional[str] = None,
    visa_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get cities with filtering by query parameters."""
    try:
        # Base query
        base_query = """
            SELECT id, name, country, lat, lng, 
                   averageTemperature, precipitation, seasons, 
                   housing, food, transportation, entertainment, costOfLivingIndex, 
                   averageWifiSpeed, coworkingSpaces, 
                   healthcareIndex, safetyIndex, pollutionIndex, 
                   communitySize, monthlyMeetups, visaRequirements
            FROM `capstone-justus.digital_nomad.cities`
            WHERE 1=1
        """
        
        query_params = [
            bigquery.ScalarQueryParameter("limit", "INT64", limit),
            bigquery.ScalarQueryParameter("offset", "INT64", offset),
        ]
        
        # Apply filters with proper STRING casting
        if min_temp is not None:
            base_query += """
                AND SAFE_CAST(NULLIF(averageTemperature, '') AS FLOAT64) IS NOT NULL
                AND SAFE_CAST(NULLIF(averageTemperature, '') AS FLOAT64) >= SAFE_CAST(@min_temp AS FLOAT64)
            """
            query_params.append(bigquery.ScalarQueryParameter("min_temp", "STRING", min_temp))
        
        if max_temp is not None:
            base_query += """
                AND SAFE_CAST(NULLIF(averageTemperature, '') AS FLOAT64) IS NOT NULL
                AND SAFE_CAST(NULLIF(averageTemperature, '') AS FLOAT64) <= SAFE_CAST(@max_temp AS FLOAT64)
            """
            query_params.append(bigquery.ScalarQueryParameter("max_temp", "STRING", max_temp))
        
        if max_cost is not None:
            base_query += """
                AND SAFE_CAST(NULLIF(housing, '') AS FLOAT64) IS NOT NULL
                AND SAFE_CAST(NULLIF(food, '') AS FLOAT64) IS NOT NULL
                AND (SAFE_CAST(NULLIF(housing, '') AS FLOAT64) + SAFE_CAST(NULLIF(food, '') AS FLOAT64)) <= SAFE_CAST(@max_cost AS FLOAT64)
            """
            query_params.append(bigquery.ScalarQueryParameter("max_cost", "STRING", max_cost))
        
        if visa_type is not None:
            base_query += " AND visaRequirements = @visa_type"
            query_params.append(bigquery.ScalarQueryParameter("visa_type", "STRING", visa_type))
        
        # Pagination and ordering
        base_query += " ORDER BY name LIMIT @limit OFFSET @offset"
        
        # Execute query
        job_config = bigquery.QueryJobConfig(query_parameters=query_params)
        job = client.query(base_query, job_config=job_config)
        results = job.result()

        # Process results
        cities_list = []
        for row in results:
            try:
                cities_list.append({
                    "id": row["id"],
                    "name": row["name"],
                    "country": row["country"],
                    "coordinates": {
                        "lat": float(row["lat"]) if row["lat"] and row["lat"].strip() else None,
                        "lng": float(row["lng"]) if row["lng"] and row["lng"].strip() else None
                    },
                    "metrics": {
                        "climate": {
                            "averageTemperature": float(row["averageTemperature"]) if row["averageTemperature"] and row["averageTemperature"].strip() else None,
                            "precipitation": float(row["precipitation"]) if row["precipitation"] and row["precipitation"].strip() else None,
                            "seasons": row["seasons"].split(", ") if row["seasons"] else []
                        },
                        "cost": {
                            "housing": float(row["housing"]) if row["housing"] and row["housing"].strip() else None,
                            "food": float(row["food"]) if row["food"] and row["food"].strip() else None,
                            "transportation": float(row["transportation"]) if row["transportation"] and row["transportation"].strip() else None,
                            "entertainment": float(row["entertainment"]) if row["entertainment"] and row["entertainment"].strip() else None,
                            "costOfLivingIndex": float(row["costOfLivingIndex"]) if row["costOfLivingIndex"] and row["costOfLivingIndex"].strip() else None
                        },
                        "infrastructure": {
                            "averageWifiSpeed": float(row["averageWifiSpeed"]) if row["averageWifiSpeed"] and row["averageWifiSpeed"].strip() else None,
                            "coworkingSpaces": int(row["coworkingSpaces"]) if row["coworkingSpaces"] and row["coworkingSpaces"].strip() else None
                        },
                        "qualityOfLife": {
                            "healthcareIndex": float(row["healthcareIndex"]) if row["healthcareIndex"] and row["healthcareIndex"].strip() else None,
                            "safetyIndex": float(row["safetyIndex"]) if row["safetyIndex"] and row["safetyIndex"].strip() else None,
                            "pollutionIndex": float(row["pollutionIndex"]) if row["pollutionIndex"] and row["pollutionIndex"].strip() else None
                        },
                        "digitalNomad": {
                            "communitySize": int(row["communitySize"]) if row["communitySize"] and row["communitySize"].strip() else None,
                            "monthlyMeetups": int(row["monthlyMeetups"]) if row["monthlyMeetups"] and row["monthlyMeetups"].strip() else None,
                            "visaRequirements": row["visaRequirements"]
                        }
                    }
                })
            except Exception as e:
                print(f"Error processing row {row}: {e}")
        
        return {"cities": cities_list if cities_list else []}
    except Exception as e:
        print(f"Error in filter_cities: {e}")
        return {"error": str(e)}


# -----------------------
# 🔹 Run FastAPI App
# -----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


