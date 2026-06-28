from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
import time

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Mock DB for integrations
MOCK_INTEGRATIONS = [
    { "id": "sap", "name": "SAP S/4HANA Finance", "type": "ERP", "status": "connected", "lastSync": "10 mins ago" },
    { "id": "oracle", "name": "Oracle PeopleSoft", "type": "HRMS", "status": "disconnected", "lastSync": "2 days ago" },
    { "id": "mysql", "name": "Legacy Student DB (MySQL)", "type": "Database", "status": "connected", "lastSync": "1 min ago" },
    { "id": "blackboard", "name": "Blackboard LMS", "type": "LMS", "status": "connected", "lastSync": "5 mins ago" }
]

@router.get("/")
async def list_integrations():
    return MOCK_INTEGRATIONS

@router.post("/{integration_id}/sync")
async def sync_integration(integration_id: str):
    for integration in MOCK_INTEGRATIONS:
        if integration["id"] == integration_id:
            integration["status"] = "connected"
            integration["lastSync"] = "Just now"
            return {"status": "success", "message": f"Synced {integration_id}"}
    raise HTTPException(status_code=404, detail="Integration not found")
