from typing import Dict, Any, List, Callable, Awaitable
from enum import Enum
import asyncio
from datetime import datetime

class EventType(Enum):
    # System Events
    SYSTEM_STARTUP = "system.startup"
    ERROR_OCCURRED = "system.error"
    
    # User Events
    USER_LOGIN = "user.login"
    ACCREDITATION_RENEWAL_DUE = "accreditation.renewal_due"
    
    # Application Events
    ATTENDANCE_UPDATED = "attendance.updated"
    GRADE_CHANGED = "grade.changed"
    ATTENDANCE_BELOW_THRESHOLD = "attendance.below_threshold"
    WORKFLOW_STARTED = "workflow.started"
    APPROVAL_REQUIRED = "approval.required"
    DOCUMENT_GENERATED = "document.generated"
    RECOMMENDATION_CREATED = "recommendation.created"
    AGENT_RESPONSE = "agent.response"

class Event:
    def __init__(self, event_type: EventType, source_agent: str, payload: Dict[str, Any]):
        self.event_type = event_type
        self.source_agent = source_agent
        self.payload = payload
        self.timestamp = datetime.now()

class EventBus:
    def __init__(self):
        self.subscribers: Dict[EventType, List[Callable[[Event], Awaitable[None]]]] = {}
    
    def subscribe(self, event_type: EventType, handler: Callable[[Event], Awaitable[None]]):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)
        print(f"🔌 Subscribed to {event_type.value}")
    
    async def publish(self, event: Event):
        if event.event_type in self.subscribers:
            handlers = self.subscribers[event.event_type]
            # Execute handlers concurrently
            await asyncio.gather(*[handler(event) for handler in handlers])
            
# Global Instance
event_bus = EventBus()
