import uuid
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum
from app.core.event_bus import event_bus, Event, EventType
from app.services.llm_service import LLMService

class RecommendationType(str, Enum):
    ACADEMIC = "ACADEMIC"
    WELLNESS = "WELLNESS"
    Administrative = "ADMINISTRATIVE"

class Recommendation:
    def __init__(self, title: str, description: str, role: str, priority: str = "medium", actions: List[dict] = None):
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.target_role = role
        self.priority = priority
        self.suggested_actions = actions or []
        self.status = "pending" # pending, accepted, dismissed
        self.created_at = datetime.now()

class RecommendationEngine:
    _instance = None
    _recommendations: List[Recommendation] = []
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RecommendationEngine, cls).__new__(cls)
            cls._instance.llm_service = LLMService()
            # Subscribe to passive triggers
            event_bus.subscribe(EventType.ATTENDANCE_BELOW_THRESHOLD, cls._handle_attendance_drop)
            event_bus.subscribe(EventType.GRADE_BELOW_THRESHOLD, cls._handle_grade_drop)
        return cls._instance

    @classmethod
    async def _handle_attendance_drop(cls, event: Event):
        # Auto-generate recommendation
        print("🧠 RecommendationEngine: Analyzing Attendance Drop...")
        payload = event.payload
        student_id = payload.get("student_id", "Unknown")
        
        rec = Recommendation(
            title=f"Attendance Alert: {student_id}",
            description=f"Student attendance has dropped to {payload.get('attendance', 0)}%. Immediate intervention required.",
            role="faculty",
            priority="high",
            actions=[
                {"label": "Initiate Intervention Workflow", "action_type": "button", "api_call": "/api/v1/workflows/start", "payload": {"template": "student_intervention", "context": payload}},
                {"label": "Email Parents", "action_type": "button", "variant": "secondary"}
            ]
        )
        cls._recommendations.append(rec)
        await event_bus.publish(Event(EventType.RECOMMENDATION_CREATED, {"rec_id": rec.id}))

    @classmethod
    async def _handle_grade_drop(cls, event: Event):
         pass

    async def generate_active_recommendations(self, query: str, context: dict) -> List[Recommendation]:
        """
        Generates active recommendations based on query and context data.
        In a full implementation, this would:
        1. Fetch real-time data from DB based on context (role, department).
        2. Feed data + query to LLM.
        3. Parse JSON response.
        """
        role_id = context.get('role_id', 'unknown')
        print(f"🧠 Generating Active Recs for {role_id}: {query}")

        # Simulate Data Fetch based on keywords
        data_summary = ""
        if "attendance" in query.lower():
            data_summary = "Avg Attendance: 82%. 15 Students < 75%."
        elif "budget" in query.lower():
            data_summary = "Budget Utilization: 65%. Q4 Remaining."
        elif "research" in query.lower():
            data_summary = "Publications: 12. Grants Pending: 2."

        # Mock Intelligence Logic (Replace with LLM Call in production)
        recs = []
        
        if "intervention" in query.lower() or "attendance" in query.lower():
            recs.append(Recommendation(
                title="Targeted Attendance Intervention",
                description=f"Data shows 15 students below threshold. Suggest launching automated intervention workflow. {data_summary}",
                role=role_id,
                priority="high",
                actions=[
                    {"label": "Launch Intervention Workflow", "action_type": "button", "api_call": "/api/v1/workflows/start", "payload": {"template": "student_intervention"}},
                    {"label": "View At-Risk Students", "action_type": "link", "url": "/students?filter=risk"}
                ]
            ))
        
        if "grant" in query.lower() or "research" in query.lower():
             recs.append(Recommendation(
                title="Apply for SERB Grant",
                description="Upcoming deadine for SERB Power Grant. Your profile matches eligible criteria.",
                role=role_id,
                priority="medium",
                actions=[{"label": "Draft Proposal", "action_type": "button"}]
            ))
            
        if not recs:
            # Default fallback if no specific keyword matches
            recs.append(Recommendation(
                title="General System Optimization",
                description="System performance is stable. No critical anomalies detected.",
                role=role_id,
                priority="low",
                actions=[{"label": "View Dashboard", "action_type": "link", "url": "/"}]
            ))

        self._recommendations.extend(recs)
        return recs

    def get_pending_recommendations(self, role: str) -> List[dict]:
        return [
            {
                "id": r.id, 
                "title": r.title, 
                "description": r.description, 
                "priority": r.priority, 
                "actions": r.suggested_actions,
                "created_at": r.created_at.isoformat()
            } 
            for r in self._recommendations 
            if r.status == "pending" and (r.target_role == role or role == "orchestrator")
        ]

recommendation_engine = RecommendationEngine()
