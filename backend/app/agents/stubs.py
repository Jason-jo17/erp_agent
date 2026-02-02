from typing import Dict, List, Any, Optional
from .base_agent import BaseAgent

class GenericStubAgent(BaseAgent):
    def __init__(self, name: str, desc: str):
        super().__init__(name, desc)
    
    def _initialize_tools(self) -> List[Dict]:
        return []
    
    def _build_system_prompt(self) -> str:
        return f"You are the {self.agent_name}."
    
    async def _execute_agent_logic(self, query: str, context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        # Mock response using LLM or static
        return {
            "response": f"This is a placeholder response from {self.agent_name}. I can process '{query}'.",
            "actions_taken": []
        }

# Specialized Classes that inherit from Stub
class ExaminationAgent(GenericStubAgent):
    def __init__(self): super().__init__("Examination Agent", "Manages exams and results")

class FinanceAgent(GenericStubAgent):
    def __init__(self): super().__init__("Finance Agent", "Manages fees and budgets")

class QualityAssuranceAgent(GenericStubAgent):
    def __init__(self): super().__init__("Quality Assurance Agent", "Manages NBA/NAAC compliance")

class StudentServicesAgent(GenericStubAgent):
    def __init__(self): super().__init__("Student Services Agent", "Manages placements and hostels")

class AdministrativeAgent(GenericStubAgent):
    def __init__(self): super().__init__("Administrative Agent", "Manages HR and files")

class ResearchAgent(GenericStubAgent):
    def __init__(self): super().__init__("Research Agent", "Manages projects and publications")

class ComplianceAgent(GenericStubAgent):
    def __init__(self): super().__init__("Compliance Agent", "Manages AICTE disclosures")
