from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    query: str
    user_role: str = "FACULTY"
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    agent_name: Optional[str] = None
    actions_taken: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}
