from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ReportRequest(BaseModel):
    template: str
    context: str

class SuggestionRequest(BaseModel):
    template: str
    context: str
    current_content: str
    focus_area: Optional[str] = None
