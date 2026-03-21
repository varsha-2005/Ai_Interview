from motor.motor_asyncio import AsyncIOMotorClient
import os

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db_name = os.getenv("DB_NAME", "ai_interview")
db = client[db_name]