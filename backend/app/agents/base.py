from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.services.llm_service import LLMService
from app.services.knowledge_service import KnowledgeService
from app.schemas.agent_schema import AgentResponse
from app.core.event_bus import event_bus, Event, EventType

class BaseAgent:
    def __init__(self, name: str, role: str, db: AsyncSession = None):
        self.name = name
        self.role = role
        self.db = db
        self.context: Dict[str, Any] = {}
        # Initialize Services
        self.llm_service = LLMService()
        self.knowledge_service = KnowledgeService()

    async def process_request(self, query: str, context: Dict[str, Any] = None) -> AgentResponse:
        """
        Main entry point for the agent.
        Should be overridden by subclasses to implement specific logic or standard RAG flow.
        """
        # 1. OPTIMIZATION: Check Mock Mode FIRST to skip RAG/DB latency
        mock_mode = context.get('mock_mode', False) if context else False
        if mock_mode:
            print(f"🚀 MOCK MODE: Skipping RAG for {self.name}...")
            # Direct short-circuit to LLM Service Mock
            return await self.llm_service.get_response(self.name, query, "", force_mock=True)

        # Default RAG implementation if not overridden
        rag_context = self.knowledge_service.search(query)
        
        # Merge passed context (history)
        history_text = context.get('history', '') if context else ''
        
        full_context = f"{rag_context}\n\n[Recent Conversation History]:\n{history_text}"
        
        response = await self.llm_service.get_response(self.name, query, full_context, force_mock=mock_mode)
        
        # Publish Event
        await event_bus.publish(Event(
            event_type=EventType.AGENT_RESPONSE,
            source_agent=self.name.lower(),
            payload={
                "query": query,
                "response_content": response.content,
                "action_items": [a.dict() for a in response.action_items]
            }
        ))
        
        return response

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        # Wrapper for executing tools with logging/error handling.
        pass

    def update_context(self, key: str, value: Any):
        self.context[key] = value

    async def proactive_briefing(self) -> AgentResponse:
        # Generates a proactive briefing (e.g., on login).
        # Default implementation uses LLM to generate a generic greeting structure
        return await self.llm_service.get_response(self.name, f"Generate a welcome briefing for {self.role}", "")
