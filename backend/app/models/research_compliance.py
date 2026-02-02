import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, Text, DECIMAL, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .base import TimeStampedBase

class ResearchProject(TimeStampedBase):
    __tablename__ = "research_projects"

    project_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_title = Column(String(500), nullable=False)
    principal_investigator = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    funding_agency = Column(String(300))
    sanctioned_amount = Column(DECIMAL(15,2))
    status = Column(String(50))


class Publication(TimeStampedBase):
    __tablename__ = "publications"

    publication_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    authors = Column(ARRAY(UUID(as_uuid=True))) # Array of user_ids
    publication_type = Column(String(100))
    publication_year = Column(Integer)
    indexing = Column(ARRAY(String)) # SCI, SCOPUS


class ComplianceCalendar(TimeStampedBase):
    __tablename__ = "compliance_calendar"

    compliance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compliance_name = Column(String(300))
    regulatory_body = Column(String(100))
    due_date = Column(Date)
    status = Column(String(50))


class AQARData(TimeStampedBase):
    __tablename__ = "aqar_data"

    aqar_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    academic_year = Column(String(10), unique=True)
    status = Column(String(50))
    data = Column(JSONB)
