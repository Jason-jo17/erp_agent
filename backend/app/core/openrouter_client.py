from openai import AsyncOpenAI
from .config import settings

# Initialize Async Client for OpenRouter
openrouter_client = AsyncOpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)

async def check_connection():
    try:
        models = await openrouter_client.models.list()
        return True
    except Exception as e:
        print(f"OpenRouter Connection Error: {e}")
        return False
