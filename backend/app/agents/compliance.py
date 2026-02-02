from .base import BaseAgent, AgentResponse

class ComplianceAgent(BaseAgent):
    """
    Compliance Agent
    Handles AICTE, NIRF, AISHE, Regulations.
    """
    def __init__(self, db=None):
        super().__init__("Compliance Agent", "compliance", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " compliance aicte nirf aishe regulation approval mandatory")
        return await self.llm_service.get_response(self.name, query, rag_context)
