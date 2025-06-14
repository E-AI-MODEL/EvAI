from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    API_KEY: str  # In production, use environment variable
    API_KEY_NAME: str = "X-API-Key"
    API_KEY_HEADER: str = "X-API-Key"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings() 