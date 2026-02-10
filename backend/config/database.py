from motor.motor_asyncio import AsyncIOMotorClient
from .settings import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_storage(self):
        if not settings.MONGO_URL or not settings.DB_NAME:
            logger.warning("MongoDB credentials missing. Skipping database connection.")
            self.db = None
            return

        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URL)
            self.db = self.client[settings.DB_NAME]
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB.")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            self.db = None

    async def close_storage_connection(self):
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB connection.")

db = Database()
