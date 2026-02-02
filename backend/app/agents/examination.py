from .base import BaseAgent, AgentResponse

class ExaminationAgent(BaseAgent):
    """
    Examination Agent
    Handles exams, results, certificates, hall tickets.
    """
    def __init__(self, db=None):
        super().__init__("Examination Agent", "examination", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " exam schedule result grade rules evaluation")
        return await self.llm_service.get_response(self.name, query, rag_context)
