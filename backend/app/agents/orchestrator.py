from .base import BaseAgent, AgentResponse
from .academic import AcademicAgent
from .examination import ExaminationAgent
from .finance import FinanceAgent
from .quality import QualityAssuranceAgent
from .student_services import StudentServicesAgent
from .administrative import AdministrativeAgent
from .research import ResearchAgent
from .compliance import ComplianceAgent
from .accreditation import AccreditationManagerAgent
from typing import Dict
from app.core.agent_communication import agent_communicator
import json

class OrchestratorAgent(BaseAgent):
    def __init__(self, db=None):
        super().__init__("Orchestrator", "orchestrator", db)
        self.agents: Dict[str, BaseAgent] = {
            "academic": AcademicAgent(db),
            "examination": ExaminationAgent(db),
            "finance": FinanceAgent(db),
            "quality": QualityAssuranceAgent(db),
            "student_services": StudentServicesAgent(db),
            "administrative": AdministrativeAgent(db),
            "research": ResearchAgent(db),
            "compliance": ComplianceAgent(db),
            "accreditation_manager": AccreditationManagerAgent(db)
        }
        
        # Register Agents for Inter-Communication
        agent_communicator.register_agent("orchestrator", self)
        for name, agent in self.agents.items():
            agent_communicator.register_agent(name, agent)

    async def process_request(self, query: str, context: dict = None) -> AgentResponse:
        query_lower = query.lower()
        role_id = context.get('role_id', 'orchestrator') if context else 'orchestrator'
        
        # 0. DIRECT ROLE ROUTING
        # If the user is specifically the Accreditation Manager, default to that agent
        if role_id == "accreditation_manager":
            return await self.agents["accreditation_manager"].process_request(query, context)

        # Intent Keywords
        intent_map = {
            "academic": ["attendance", "timetable", "workload", "faculty", "course", "lesson", "co-po", "curriculum", "syllabus", "teaching"],
            "examination": ["exam", "result", "grade", "marks", "hall ticket", "certificate", "question paper"],
            "finance": ["fee", "budget", "payment", "salary", "invoice", "purchase"],
            "quality": ["naac", "nba", "aqar", "accreditation", "iqac", "attainment"],
            "student_services": ["placement", "internship", "hostel", "scholarship", "grievance", "club"],
            "administrative": ["leave", "hr", "meeting", "circular", "file", "staff"],
            "research": ["research", "publication", "patent", "project", "phd", "grant"],
            "compliance": ["aicte", "nirf", "aishe", "compliance", "regulation", "mandatory"],
            "accreditation_manager": ["washington accord", "mbgl", "digital audit", "sar", "po gap", "program outcome"]
        }

        # Determine target agent by keyword score
        scores = {agent: sum(1 for kw in kws if kw in query_lower) for agent, kws in intent_map.items()}
        best_agent = max(scores, key=scores.get)
        
        target_agent = None
        if scores[best_agent] > 0:
            target_agent = self.agents.get(best_agent)

        if target_agent:
            return await target_agent.process_request(query, context)

        # Fallback to Orchestrator RAG
        mock_mode = context.get('mock_mode', False) if context else False
        
        if mock_mode:
             print(f"🚀 MOCK MODE: Skipping RAG for Orchestrator...")
             return await self.llm_service.get_response(self.name, query, "", force_mock=True)

        rag_context = self.knowledge_service.search(query)
        return await self.llm_service.get_response(self.name, query, rag_context, force_mock=False)

    async def proactive_briefing(self, role_id: str) -> AgentResponse:
        # Simple mapping for briefing
        mapping = {
            "faculty": self.agents["academic"],
            "admin": self.agents["administrative"],
            "student": self.agents["student_services"]
        }
        
        agent = mapping.get(role_id)
        if agent:
            # Delegate to specialized agent
            return await agent.proactive_briefing()
            
        context = self.knowledge_service.search("system status")
        return await self.llm_service.get_response("Orchestrator", "Generate concise system overview with 1 action item and 1 PDF report", context)
