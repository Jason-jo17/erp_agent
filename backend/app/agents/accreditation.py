from .base import BaseAgent, AgentResponse
import json
from app.services.llm_service import LLMService

class AccreditationManagerAgent(BaseAgent):
    def __init__(self, db=None):
        super().__init__("Accreditation Manager", "accreditation_manager", db)
        self.llm_service = LLMService()

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        # 1. Check for specific tool invocations based on intent
        if "sar" in query.lower() and "generate" in query.lower():
            # Mock data for SAR generation
            program_data = {
                "program_name": "B.Tech Computer Science",
                "academic_year": "2024-25",
                "strengths": "Strong Industry Connect, High Placement",
                "weaknesses": "Research Funding",
                "faculty_count": 25,
                "placement_rate": 85
            }
            narrative = await self.llm_service.generate_sar_narrative("Executive Summary", program_data)
            
            return AgentResponse(
                content=narrative,
                agent_name=self.name,
                success=True,
                documents_generated=[{"filename": "SAR_Executive_Summary.md", "path": "/api/v1/documents/download?file=SAR.md", "type": "markdown"}]
            )

        if "gap" in query.lower() and "analysis" in query.lower():
            # Mock PO attainment
            po_data = {"PO1": 75, "PO2": 72, "PO3": 68, "PO4": 58, "PO5": 80}
            analysis = await self.llm_service.analyze_gaps_with_llm(po_data)
            
            return AgentResponse(
                content=f"**Gap Analysis Generated**\n\nIdentified {len(analysis.get('gaps', []))} gaps requiring attention.",
                visualizations=[
                    {
                        "type": "bar",
                        "title": "PO Attainment Gaps",
                        "data": {"labels": list(po_data.keys()), "values": list(po_data.values())}
                    }
                ],
                success=True,
                agent_name=self.name
            )

        # 2. General Chat Fallback
        return await self.llm_service.get_response(self.name, query, context="")

    async def proactive_briefing(self) -> AgentResponse:
        return AgentResponse(
            content="**Accreditation Status Briefing**\n\n- **MBGL Status**: Level 3 (Established)\n- **Renewal Due**: B.Tech MECH (180 days)\n- **Action Required**: Upload latest faculty publications for SAR.",
            agent_name=self.name,
            success=True
        )
