import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, Text, DECIMAL, ARRAY, JSON, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .base import TimeStampedBase

class PlacementDrive(TimeStampedBase):
    __tablename__ = "placement_drives"

    drive_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String(300))
    drive_date = Column(Date)
    job_role = Column(String(200))
    ctc_offered = Column(DECIMAL(10,2))
    eligibility_criteria = Column(JSONB)
    drive_status = Column(String(50))


class Internship(TimeStampedBase):
    __tablename__ = "internships"

    internship_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    company_name = Column(String(300))
    start_date = Column(Date)
    end_date = Column(Date)
    faculty_mentor_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    status = Column(String(50))


class Grievance(TimeStampedBase):
    __tablename__ = "grievances"

    grievance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_number = Column(String(50), unique=True)
    raised_by = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    grievance_type = Column(String(100))
    description = Column(Text)
    priority = Column(String(50))
    status = Column(String(50))
    resolution = Column(Text)
