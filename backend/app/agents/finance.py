from .base import BaseAgent, AgentResponse

class FinanceAgent(BaseAgent):
    """
    Finance Agent
    Handles fees, budget, payments, salaries.
    """
    def __init__(self, db=None):
        super().__init__("Finance Agent", "finance", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " finance budget fee salary invoice payments")
        return await self.llm_service.get_response(self.name, query, rag_context)
