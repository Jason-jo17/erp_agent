from .base import BaseAgent, AgentResponse

class QualityAssuranceAgent(BaseAgent):
    """
    Quality Assurance Agent
    Handles NAAC, NBA, AQAR, Accreditation.
    """
    def __init__(self, db=None):
        super().__init__("Quality Assurance Agent", "quality", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " naac nba aqar accreditation iqac criteria")
        return await self.llm_service.get_response(self.name, query, rag_context)
