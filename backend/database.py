from google.cloud import bigquery
import os

# Initialize BigQuery client
# When deployed to Cloud Run, authentication will use the service account attached to the service
client = bigquery.Client()

# Dataset and Table References
PROJECT_ID = "capstone-justus"
DATASET_ID = "digital_nomad"
# Centralized table paths
USERS_TABLE = f"{PROJECT_ID}.{DATASET_ID}.users"
TRAVEL_PLANS_TABLE = f"{PROJECT_ID}.{DATASET_ID}.travel_plans"
PREFERENCES_TABLE = f"{PROJECT_ID}.{DATASET_ID}.preferences"
