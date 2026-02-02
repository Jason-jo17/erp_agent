from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Dict
import uuid
from datetime import datetime

class WorkflowStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    WAITING_APPROVAL = "waiting_approval"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class WorkflowStep:
    step_id: str
    step_name: str
    agent: str
    action: str
    requires_approval: bool = False
    approver_role: Optional[str] = None
    depends_on: List[str] = field(default_factory=list)
    status: WorkflowStatus = WorkflowStatus.PENDING

class WorkflowEngine:
    def __init__(self):
        self.active_workflows: Dict[str, Dict] = {}
        self.workflow_templates = {
            "student_intervention": [
                WorkflowStep(
                    step_id="identify_students",
                    step_name="Identify At-Risk Students",
                    agent="academic",
                    action="identify_shortage_students"
                ),
                WorkflowStep(
                    step_id="generate_letters",
                    step_name="Generate Shortage Letters",
                    agent="academic",
                    action="generate_shortage_letters",
                    depends_on=["identify_students"]
                ),
                WorkflowStep(
                    step_id="hod_approval",
                    step_name="HOD Approval Required",
                    agent="administrative",
                    action="request_approval",
                    requires_approval=True,
                    approver_role="HOD",
                    depends_on=["generate_letters"]
                ),
                WorkflowStep(
                    step_id="send_to_parents",
                    step_name="Send to Parents",
                    agent="administrative",
                    action="send_email",
                    depends_on=["hod_approval"]
                )
            ]
        }
    
    async def start_workflow(self, template_name: str, inputs: Dict, initiator: str) -> str:
        if template_name not in self.workflow_templates:
            raise ValueError(f"Workflow template {template_name} not found")
            
        workflow_id = str(uuid.uuid4())
        steps = [step for step in self.workflow_templates[template_name]] # Copy steps
        
        self.active_workflows[workflow_id] = {
            "id": workflow_id,
            "template": template_name,
            "status": WorkflowStatus.IN_PROGRESS,
            "steps": steps,
            "inputs": inputs,
            "initiator": initiator,
            "created_at": datetime.now()
        }
        
        print(f"🚀 Workflow Started: {template_name} (ID: {workflow_id})")
        return workflow_id
    
    async def approve_step(self, workflow_id: str, step_id: str, approver_role: str):
        workflow = self.active_workflows.get(workflow_id)
        if not workflow:
            raise ValueError("Workflow not found")
            
        # Mock approval logic
        print(f"✅ Step {step_id} approved by {approver_role} in workflow {workflow_id}")
        return True

workflow_engine = WorkflowEngine()
