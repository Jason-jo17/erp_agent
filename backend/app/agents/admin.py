from .base import BaseAgent, AgentResponse

class AdminAgent(BaseAgent):
    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        # Use RAG for Admin queries
        # Enhance query context with specific admin keywords
        context_data = self.knowledge_service.search(query + " finance budget approval governance academic calendar")
        return await self.llm_service.get_response(self.name, query, context_data)

    async def proactive_briefing(self) -> str:
        # Generate briefing
        context = self.knowledge_service.search("pending approvals budget status compliance")
        resp = await self.llm_service.get_response(
            self.name,
            "Generate a dashboard summary for an Administrator including pending approvals, budget status, and compliance alerts.",
            context
        )
        return resp.content
