from .base import BaseAgent, AgentResponse

class StudentServicesAgent(BaseAgent):
    """
    Student Services Agent
    Handles placements, internships, hostels, scholarships.
    """
    def __init__(self, db=None):
        super().__init__("Student Services Agent", "student_services", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        rag_context = self.knowledge_service.search(query + " placement internship hostel scholarship grievance club")
        return await self.llm_service.get_response(self.name, query, rag_context)
