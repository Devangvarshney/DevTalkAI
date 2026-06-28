import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "english_speak")

# Connect to the MongoDB client
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_db():
    return db
