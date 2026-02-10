from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "KAIRA API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # MongoDB Settings
    MONGO_URL: Optional[str] = None
    DB_NAME: Optional[str] = None
    
    # Security
    CORS_ORIGINS: str = "*"
    SECRET_KEY: str = "development-secret-key"
    
    # Integrations
    N8N_WEBHOOK_URL: str
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(ROOT_DIR, f".env.{os.getenv('APP_ENV', 'development')}"),
        env_file_encoding='utf-8',
        extra='ignore'
    )

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
