from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.models import Base

# Create Async Engine
# echo=True for debugging, False for production
engine = create_async_engine(
    settings.assemble_db_url,
    echo=False,
    future=True
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

# Dependency for API endpoints
async def get_db():
    try:
        session = AsyncSessionLocal()
    except Exception:
        # Fallback for when DB is unreachable
        yield None
        return

    try:
        yield session
    finally:
        await session.close()
