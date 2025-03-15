import uuid
from google.cloud import bigquery
from passlib.context import CryptContext
from typing import Optional, List
from backend.database import client, USERS_TABLE, TRAVEL_PLANS_TABLE, PREFERENCES_TABLE

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -----------------------
# 🔹 GET USER BY ID
# -----------------------
def get_user(user_id: str):
    query = f"""
        SELECT * FROM `{USERS_TABLE}`
        WHERE id = @user_id
        LIMIT 1
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("user_id", "STRING", user_id)]
    )
    results = client.query(query, job_config=job_config).result()
    return next(iter(results), None)

# -----------------------
# 🔹 GET USER BY EMAIL
# -----------------------
def get_user_by_email(email: str):
    query = f"""
        SELECT * FROM `{USERS_TABLE}`
        WHERE email = @user_email
        LIMIT 1
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("user_email", "STRING", email)]
    )
    results = client.query(query, job_config=job_config).result()
    return next(iter(results), None)

# -----------------------
# 🔹 GET USERS (Pagination)
# -----------------------
def get_users(skip: int = 0, limit: int = 100):
    query = f"""
        SELECT * FROM `{USERS_TABLE}`
        ORDER BY email
        LIMIT @limit OFFSET @skip
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("limit", "INT64", limit),
            bigquery.ScalarQueryParameter("skip", "INT64", skip),
        ]
    )
    results = client.query(query, job_config=job_config).result()
    return [row for row in results]

# -----------------------
# 🔹 CREATE USER
# -----------------------
def create_user(user):
    user_id = str(uuid.uuid4())  # Generate a unique user ID
    password_hash = pwd_context.hash(user.password)

    rows_to_insert = [{
        "id": user_id,
        "email": user.email,
        "password_hash": password_hash
    }]

    errors = client.insert_rows_json(USERS_TABLE, rows_to_insert)

    if errors:
        raise Exception(f"BigQuery Insert Error: {errors}")

    return {
        "id": user_id,
        "email": user.email,
    }

# -----------------------
# 🔹 VERIFY PASSWORD
# -----------------------
def verify_password(plain_password: str, password_hash: str):
    return pwd_context.verify(plain_password, password_hash)

# -----------------------
# 🔹 AUTHENTICATE USER
# -----------------------
def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user_by_email(email)
    
    if not user:
        if email == "demo@digitalnomad.com" and password == "demo123456":
            return create_user(user)
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    return user

# -----------------------
# 🔹 GET USER TRAVEL PLANS
# -----------------------
def get_user_travel_plans(user_id: str, skip: int = 0, limit: int = 100):
    query = f"""
        SELECT * FROM `{TRAVEL_PLANS_TABLE}`
        WHERE user_id = @user_id
        ORDER BY created_at DESC
        LIMIT @limit OFFSET @skip
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
            bigquery.ScalarQueryParameter("limit", "INT64", limit),
            bigquery.ScalarQueryParameter("skip", "INT64", skip),
        ]
    )
    results = client.query(query, job_config=job_config).result()
    return [row for row in results]

# -----------------------
# 🔹 CREATE USER TRAVEL PLAN
# -----------------------
def create_user_travel_plan(plan, user_id: str):
    rows_to_insert = [{
        "user_id": user_id,
        "destination": plan.destination,
        "start_date": plan.start_date,
        "end_date": plan.end_date,
    }]

    errors = client.insert_rows_json(TRAVEL_PLANS_TABLE, rows_to_insert)

    if errors:
        raise Exception(f"BigQuery Insert Error: {errors}")

    return plan

# -----------------------
# 🔹 UPDATE USER PREFERENCES
# -----------------------
def update_user_preferences(user_id: str, preferences):
    existing_query = f"""
        SELECT * FROM `{PREFERENCES_TABLE}`
        WHERE user_id = @user_id
        LIMIT 1
    """
    
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("user_id", "STRING", user_id)]
    )
    results = client.query(existing_query, job_config=job_config).result()

    existing_pref = next(iter(results), None)

    if existing_pref:
        update_query = f"""
            UPDATE `{PREFERENCES_TABLE}`
            SET preferences = @preferences
            WHERE user_id = @user_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("preferences", "STRING", preferences.json()),
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
            ]
        )
    else:
        update_query = f"""
            INSERT INTO `{PREFERENCES_TABLE}` (user_id, preferences)
            VALUES (@user_id, @preferences)
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
                bigquery.ScalarQueryParameter("preferences", "STRING", preferences.json()),
            ]
        )

    job = client.query(update_query, job_config=job_config)
    job.result()
    
    return preferences
