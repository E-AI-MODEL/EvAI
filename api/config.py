from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    API_KEY: str = "your-secret-key-here"  # In production, use environment variable
    API_KEY_NAME: str = "X-API-Key"
    API_KEY_HEADER: str = "X-API-Key"
    
    class Config:
        env_file = ".env"

settings = Settings() 