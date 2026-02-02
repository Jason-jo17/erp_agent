from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db_postgres import init_db
from app.api import auth, chat, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    try:
        await init_db()
    except Exception as e:
        print(f"WARNING: Database initialization failed: {e}. Running in logical mode only.")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multi-agent AI capabilities for 42+ roles in AICTE-compliant engineering colleges",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
    "http://localhost:3006", # Added new frontend port
    "http://localhost:8006",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3006",
    "http://localhost:3015",
    "http://127.0.0.1:3015",
    "http://localhost:3010",
    "http://127.0.0.1:3010"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "AICTE College Management System API is running",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(reports.router, prefix="/api/v1/documents", tags=["documents"])
# Lazy import to avoid circular dep if any (standard practice for routers)
from app.api import workflows
app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["workflows"])

from app.api import accreditation
app.include_router(accreditation.router, tags=["accreditation"])
