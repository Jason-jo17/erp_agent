from .base import BaseAgent, AgentResponse
from app.core.event_bus import event_bus, Event, EventType

class AcademicAgent(BaseAgent):
    """
    Academic Operations Agent
    Handles attendance, timetables, workload, CO-PO, lesson planning.
    """
    def __init__(self, db=None):
        super().__init__("Academic Agent", "academic", db)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        # Detect Intent (Basic Keyword Match for POC)
        if "mark attendance" in query.lower() or "absent" in query.lower():
            # Mock extracting student ID
            student_id = "21CS042" # Mock
            status = "ABSENT"
            await self.mark_attendance(student_id, status)
            
            return AgentResponse(
                content=f"Attendance for Student **{student_id}** marked as **{status}**. (Event Published)",
                success=True
            )

        # Default RAG Flow
        rag_context = self.knowledge_service.search(query + " academic syllabus curriculum faculty workload attendance")
        return await self.llm_service.get_response(self.name, query, rag_context)

    async def mark_attendance(self, student_id: str, status: str):
        print(f"📝 Marking Attendance: {student_id} -> {status}")
        # Logic to save to DB would go here
        
        # Publish Event
        await event_bus.publish(Event(
            event_type=EventType.ATTENDANCE_UPDATED,
            source_agent=self.name.lower(),
            payload={
                "student_id": student_id,
                "status": status,
                "percentage": 72  # Mock: This triggers the "Low Attendance" warning
            }
        ))
        
        # Check logic for low attendance
        if status == "ABSENT":
             await event_bus.publish(Event(
                event_type=EventType.ATTENDANCE_BELOW_THRESHOLD,
                source_agent=self.name.lower(),
                payload={
                    "student_id": student_id,
                    "percentage": 72
                }
            ))

    async def proactive_briefing(self) -> AgentResponse:
        ctx = self.knowledge_service.search("class schedule today faculty status")
        return await self.llm_service.get_response(self.name, "Generate morning academic briefing", ctx)
