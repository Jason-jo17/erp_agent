from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db_postgres import get_db
from app.agents.orchestrator import OrchestratorAgent

router = APIRouter()

from app.schemas.agent_schema import AgentResponse

class ChatRequest(BaseModel):
    query: str
    role_id: str
    mock_mode: Optional[bool] = False
    context: Optional[dict] = None

from app.services.llm_service import LLMService

@router.post("", response_model=AgentResponse)
async def chat_message(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    
    # 🔥 GLOBAL INTERCEPT: Mock Mode (Bypass Orchestrator/DB)
    if request.mock_mode:
        print(f"🚀 API MOCK INTERCEPT: Skipping ALL Agent Logic for '{request.query}'")
        llm = LLMService()
        # Direct call to mock
        return await llm.get_response(
            role=request.role_id,
            query=request.query, 
            context="",
            force_mock=True
        )

    # Instantiate Orchestrator with DB session (or None if DB failed)
    orchestrator = OrchestratorAgent(db)
    
    # Process request
    # Process request with global error handling
    try:
        # Note: Orchestrator returns AgentResponse directly
        # Inject mock_mode into context so it propagates to LLM Service
        context = request.context or {}
        context["mock_mode"] = request.mock_mode

        response = await orchestrator.process_request(request.query, {"role_id": request.role_id, **context})
        return response
    except Exception as e:
        print(f"🔥 CRITICAL: Chat Endpoint Error: {str(e)}")
        # Return a graceful error response instead of 500
        return AgentResponse(
            content=f"**System Error**: An internal error occurred while processing your request.\n\n`{str(e)}`\n\nPlease check the backend logs.",
            success=False,
            error_message=str(e),
            agent_name="System"
        )
