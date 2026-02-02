from sqlalchemy import Column, String, Integer, ForeignKey, Date, Boolean, Text, Numeric, ARRAY
from sqlalchemy.orm import relationship
from app.models.base import Base

# Washington Accord Tables

class ProgramOutcome(Base):
    __tablename__ = "program_outcomes"
    
    po_id = Column(String(10), primary_key=True)
    program_code = Column(String(20), nullable=False)
    po_number = Column(Integer, nullable=False)  # 1-12
    po_statement = Column(Text, nullable=False)
    ga_number = Column(Integer)  # 1-12 (Graduate Attribute)


class CourseOutcome(Base):
    __tablename__ = "course_outcomes"
    
    co_id = Column(String(20), primary_key=True)
    course_code = Column(String(20), nullable=False)
    co_number = Column(Integer, nullable=False)
    co_statement = Column(Text, nullable=False)
    blooms_level = Column(String(20))
    
    # Relationships
    mappings = relationship("COPOMapping", back_populates="course_outcome")


class COPOMapping(Base):
    __tablename__ = "co_po_mapping"
    
    mapping_id = Column(Integer, primary_key=True, autoincrement=True)
    co_id = Column(String(20), ForeignKey("course_outcomes.co_id"))
    po_id = Column(String(10), ForeignKey("program_outcomes.po_id"))
    correlation_level = Column(Integer)  # 1, 2, 3
    
    course_outcome = relationship("CourseOutcome", back_populates="mappings")
    program_outcome = relationship("ProgramOutcome")


class COAttainment(Base):
    __tablename__ = "co_attainment"
    
    attainment_id = Column(Integer, primary_key=True, autoincrement=True)
    co_id = Column(String(20), ForeignKey("course_outcomes.co_id"))
    academic_year = Column(String(10))
    semester = Column(Integer)
    direct_attainment = Column(Numeric(5, 2))
    indirect_attainment = Column(Numeric(5, 2))
    final_attainment = Column(Numeric(5, 2))
    target = Column(Numeric(5, 2), default=60.00)
    status = Column(String(20)) # Achieved / Not Achieved


# NAC Accreditation Tables

class AccreditationStatus(Base):
    __tablename__ = "accreditation_status"
    
    accreditation_id = Column(Integer, primary_key=True, autoincrement=True)
    entity_type = Column(String(20)) # INSTITUTION or PROGRAM
    entity_id = Column(String(50))
    accreditation_body = Column(String(50)) # NAC, NBA, etc.
    status = Column(String(20)) # ACCREDITED, NOT_ACCREDITED
    mbgl_level = Column(Integer) # 1-5
    valid_until = Column(Date)
    washington_accord_signatory = Column(Boolean, default=False)
    
    assessments = relationship("MBGLCriteriaAssessment", back_populates="accreditation")


class MBGLCriteriaAssessment(Base):
    __tablename__ = "mbgl_criteria_assessment"
    
    assessment_id = Column(Integer, primary_key=True, autoincrement=True)
    accreditation_id = Column(Integer, ForeignKey("accreditation_status.accreditation_id"))
    criterion_name = Column(String(100))
    score = Column(Numeric(3, 2))
    gaps_identified = Column(Text) # JSON or Text list
    action_plan = Column(Text)
    
    accreditation = relationship("AccreditationStatus", back_populates="assessments")


# Cross-Council Tables

class NHERCCompliance(Base):
    __tablename__ = "nherc_compliance"
    
    compliance_id = Column(Integer, primary_key=True, autoincrement=True)
    compliance_area = Column(String(100))
    status = Column(String(20))
    last_inspection_date = Column(Date)
    observations = Column(Text)


class HEGCGrant(Base):
    __tablename__ = "hegc_grants"
    
    grant_id = Column(Integer, primary_key=True, autoincrement=True)
    grant_scheme = Column(String(100))
    amount_sanctioned = Column(Numeric(12, 2))
    utilization_certificate_submitted = Column(Boolean, default=False)
    uc_submission_date = Column(Date)
