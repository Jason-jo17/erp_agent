from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.core.workflow_engine import workflow_engine, WorkflowStatus

router = APIRouter()

@router.post("/start")
async def start_workflow(request: Dict[str, Any]):
    """
    Start a new workflow instance.
    Payload: { "workflow_template": "student_intervention", "inputs": {}, "initiator": "user_email" }
    """
    template = request.get("workflow_template")
    inputs = request.get("inputs", {})
    initiator = request.get("initiator", "system")
    
    if not template:
        raise HTTPException(status_code=400, detail="workflow_template is required")
        
    try:
        workflow_id = await workflow_engine.start_workflow(template, inputs, initiator)
        return {"workflow_id": workflow_id, "status": "started"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{workflow_id}/status")
async def get_workflow_status(workflow_id: str):
    """
    Get the status of a specific workflow.
    """
    workflow = workflow_engine.active_workflows.get(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # helper to convert enum to string
    steps_data = []
    for step in workflow["steps"]:
        steps_data.append({
            "step_id": step.step_id,
            "name": step.step_name,
            "status": step.status.value,
            "requires_approval": step.requires_approval
        })

    return {
        "workflow_id": workflow_id,
        "template": workflow["template"],
        "status": workflow["status"].value,
        "steps": steps_data
    }

@router.post("/{workflow_id}/approve/{step_id}")
async def approve_step_endpoint(workflow_id: str, step_id: str, request: Dict[str, Any]):
    """
    Approve a step in the workflow.
    Payload: { "approver_role": "HOD" }
    """
    approver_role = request.get("approver_role", "Admin")
    
    try:
        success = await workflow_engine.approve_step(workflow_id, step_id, approver_role)
        return {"status": "approved", "step_id": step_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/active")
async def get_active_workflows():
    """
    List all active workflows.
    """
    workflows = []
    for wid, w in workflow_engine.active_workflows.items():
        # Calculate progress
        completed = sum(1 for s in w['steps'] if s.status == WorkflowStatus.COMPLETED)
        total = len(w['steps'])
        
        workflows.append({
            "workflow_id": wid,
            "workflow_name": w['template'],
            "status": w['status'].value,
            "current_step": completed + 1,
            "total_steps": total,
            "initiator": w['initiator']
        })
    return {"workflows": workflows}
