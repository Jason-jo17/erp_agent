from .base import BaseAgent, AgentResponse

class AdministrativeAgent(BaseAgent):
    """
    Administrative Agent
    Handles HR, Admin, Leave, Meetings.
    """
    def __init__(self, db=None):
        super().__init__("Administrative Agent", "administrative", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " admin hr leave meeting circular file staff")
        return await self.llm_service.get_response(self.name, query, rag_context)
