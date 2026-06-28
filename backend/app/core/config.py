from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AICTE College Management System"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "aicte_college"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None
    REDIS_URL: str = "redis://localhost:6379/0"

    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://localhost:3006",
        "http://localhost:8006",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3006",
        "http://localhost:3015",
        "http://127.0.0.1:3015",
        "http://localhost:3010",
        "http://127.0.0.1:3010"
    ]

    @property
    def assemble_db_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # SECURITY
    SECRET_KEY: str = "change-me-in-production"

    # OPENROUTER
    OPENROUTER_API_KEY: Optional[str] = None
    
    # MINIO
    MINIO_ENDPOINT: Optional[str] = None
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_SECURE: bool = False
    MINIO_BUCKET_NAME: str = "reports"
    
    # LOGGING
    LOG_LEVEL: str = "INFO"
    LOG_FILE_PATH: str = "logs/app.log"
    LOG_MAX_BYTES: int = 10485760
    LOG_BACKUP_COUNT: int = 5

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=True)

settings = Settings()
