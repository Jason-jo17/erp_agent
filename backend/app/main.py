from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db_postgres import init_db
from app.api import auth, chat, reports, admin, workflows, accreditation, recommendations, integrations

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
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
app.include_router(admin.router)
app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["workflows"])

from app.api import accreditation
app.include_router(accreditation.router, tags=["accreditation"])

from app.api import recommendations
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])

app.include_router(integrations.router, prefix="/api/v1")
