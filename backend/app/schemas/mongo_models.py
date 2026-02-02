from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise ValueError("Invalid ObjectId")
        return v

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class DocumentMetadata(BaseModel):
    author: Optional[str] = None
    created_date: Optional[datetime] = None
    version: Optional[str] = None
    approval_status: Optional[str] = None

class Document(MongoBaseModel):
    document_type: str # POLICY, MINUTES, COURSE_FILE
    title: str
    document_category: str # ACADEMIC, ADMIN
    file_path: str
    uploaded_by: Optional[str] = None # UUID str
    department_id: Optional[str] = None # UUID str
    tags: List[str] = []
    metadata: DocumentMetadata = Field(default_factory=DocumentMetadata)
    full_text: Optional[str] = None

class Notification(MongoBaseModel):
    notification_type: str # EMAIL, SMS, PUSH
    recipient_id: str
    recipient_role: str
    subject: str
    message: str
    priority: str = "MEDIUM"
    status: str = "PENDING"
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None

class AgentInteraction(MongoBaseModel):
    conversation_id: str
    user_id: str
    agent_type: str
    messages: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}
    status: str = "ACTIVE"
