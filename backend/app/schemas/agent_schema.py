from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ActionItem(BaseModel):
    """Structured action item for user interaction"""
    label: str = Field(..., description="Display text")
    action_type: str = Field(..., description="button|link|chip|download")
    payload: Optional[Dict] = Field(None, description="Data for action")
    icon: Optional[str] = Field(None, description="Icon name (lucide-react)")
    variant: str = Field("primary", description="primary|secondary|danger")

class Visualization(BaseModel):
    """Structured visualization data"""
    type: str = Field(..., description="pie|bar|line|table|mermaid")
    title: str = Field(..., description="Chart title")
    data: Dict[str, Any] = Field(..., description="Chart data")
    config: Optional[Dict] = Field(None, description="Chart configuration")

class Document(BaseModel):
    """Generated document metadata"""
    filename: str
    path: str
    type: str = Field("pdf", description="pdf|docx|xlsx|csv")
    size_bytes: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Notification(BaseModel):
    """Notification for UI bell icon"""
    title: str
    message: str
    type: str = Field("info", description="success|info|warning|error")
    timestamp: datetime = Field(default_factory=datetime.now)
    action: Optional[ActionItem] = None

class AgentResponse(BaseModel):
    """
    Standardized response format from all agents.
    Ensures consistent rendering across the system.
    """
    # Core content
    content: str = Field(..., description="Main response text (Markdown supported)")
    
    # Metadata
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Internal state, confidence scores, timing, tokens"
    )
    
    # Interactive elements
    action_items: List[ActionItem] = Field(
        default_factory=list,
        description="Clickable actions for user (rendered as chips)"
    )
    
    # Visualizations
    visualizations: List[Visualization] = Field(
        default_factory=list,
        description="Charts, diagrams, tables (rendered inline)"
    )
    
    # Documents
    documents_generated: List[Document] = Field(
        default_factory=list,
        description="Files generated and ready for download"
    )
    
    # Notifications
    notifications: List[Notification] = Field(
        default_factory=list,
        description="Alerts to show in bell icon"
    )
    
    # Multi-agent
    requires_approval: bool = Field(False, description="Requires user confirmation")
    approval_from: Optional[str] = Field(None, description="Role required for approval")
    
    # Status
    success: bool = Field(True)
    error_message: Optional[str] = None
    
    # Source
    agent_name: str = Field("System", description="Which agent generated this")
    processing_time: float = Field(0.0, description="Time taken in seconds")
