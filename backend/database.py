from google.cloud import bigquery
import os

# Get the absolute path of the JSON key file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, "capstone-justus-51d7198c35df.json")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH

# Initialize BigQuery client
client = bigquery.Client()

# Dataset and Table References
PROJECT_ID = "capstone-justus"
DATASET_ID = "digital_nomad"
# Centralized table paths
USERS_TABLE = f"{PROJECT_ID}.{DATASET_ID}.users"
TRAVEL_PLANS_TABLE = f"{PROJECT_ID}.{DATASET_ID}.travel_plans"
PREFERENCES_TABLE = f"{PROJECT_ID}.{DATASET_ID}.preferences"
