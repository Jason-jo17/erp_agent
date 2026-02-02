from .base import BaseAgent, AgentResponse

class FacultyAgent(BaseAgent):
    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        # Use the BaseAgent's RAG implementation
        # The prompt in LLMService is generic enough to handle "Faculty" persona via 'self.name' passed in BaseAgent
        
        # We can append specific toolkit info to context if needed
        rag_context = self.knowledge_service.search(query)
        
        # Add dynamic real-time data stubs if query requires it (Hybrid approach)
        # For now, rely on RAG + LLM
        return await self.llm_service.get_response(self.name, query, rag_context)

    async def proactive_briefing(self) -> str:
        # Use LLM to generate a dynamic briefing based on a 'morning briefing' prompt
        context = self.knowledge_service.search("schedule alerts deadlines")
        resp = await self.llm_service.get_response(
            self.name, 
            "Generate a structured morning briefing for a Faculty member including schedule and alerts. Use the context.", 
            context
        )
        return resp.content
