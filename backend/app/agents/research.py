from .base import BaseAgent, AgentResponse

class ResearchAgent(BaseAgent):
    """
    Research Agent
    Handles publications, patents, projects, PhD.
    """
    def __init__(self, db=None):
        super().__init__("Research Agent", "research", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " research publication patent project phd grant paper")
        return await self.llm_service.get_response(self.name, query, rag_context)
