import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, Time, Text, DECIMAL, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .base import TimeStampedBase

class Department(TimeStampedBase):
    __tablename__ = "departments"

    department_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_code = Column(String(20), unique=True, nullable=False)
    department_name = Column(String(200), nullable=False)
    established_year = Column(Integer)
    aicte_approval_code = Column(String(100))
    hod_user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    vision = Column(Text)
    mission = Column(Text)
    peos = Column(ARRAY(Text)) # Program Educational Objectives
    is_active = Column(Boolean, default=True)

    # Relationships
    programs = relationship("Program", back_populates="department")
    courses = relationship("Course", back_populates="department")


class Program(TimeStampedBase):
    __tablename__ = "programs"

    program_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_code = Column(String(20), unique=True, nullable=False)
    program_name = Column(String(200), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey('departments.department_id'))
    degree_type = Column(String(50)) # B.Tech, M.Tech, Ph.D.
    duration_years = Column(Integer)
    total_credits = Column(Integer)
    aicte_approval_year = Column(Integer)
    nba_accreditation_status = Column(String(50))
    nba_valid_until = Column(Date)
    intake = Column(Integer)
    program_outcomes = Column(ARRAY(Text)) # 12 POs
    program_specific_outcomes = Column(ARRAY(Text)) # 2-4 PSOs

    department = relationship("Department", back_populates="programs")
    curriculum_items = relationship("Curriculum", back_populates="program")


class Course(TimeStampedBase):
    __tablename__ = "courses"

    course_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_code = Column(String(20), unique=True, nullable=False)
    course_name = Column(String(300), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey('departments.department_id'))
    credits = Column(Integer, nullable=False)
    lecture_hours = Column(Integer, default=0)
    tutorial_hours = Column(Integer, default=0)
    practical_hours = Column(Integer, default=0)
    course_type = Column(String(50)) # THEORY, PRACTICAL, THEORY+PRACTICAL
    elective_type = Column(String(50)) # CORE, ELECTIVE, OPEN_ELECTIVE
    syllabus_url = Column(Text)
    course_outcomes = Column(ARRAY(Text)) # Array of 6 COs
    co_po_mapping = Column(JSONB) # Matrix mapping COs to POs
    prerequisites = Column(ARRAY(String))
    is_active = Column(Boolean, default=True)

    department = relationship("Department", back_populates="courses")


class Curriculum(TimeStampedBase):
    __tablename__ = "curriculum"

    curriculum_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey('programs.program_id'))
    academic_year = Column(String(10), nullable=False)
    semester = Column(Integer, nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    is_mandatory = Column(Boolean, default=True)

    program = relationship("Program", back_populates="curriculum_items")
    course = relationship("Course")


class Section(TimeStampedBase):
    __tablename__ = "sections"

    section_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey('programs.program_id'))
    academic_year = Column(String(10), nullable=False)
    semester = Column(Integer, nullable=False)
    section_name = Column(String(10), nullable=False)
    class_advisor_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    student_count = Column(Integer, default=0)


class FacultyWorkload(TimeStampedBase):
    __tablename__ = "faculty_workload"

    workload_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    academic_year = Column(String(10), nullable=False)
    semester = Column(Integer, nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    section_id = Column(UUID(as_uuid=True), ForeignKey('sections.section_id'))
    workload_type = Column(String(50)) # LECTURE, TUTORIAL, PRACTICAL, LAB
    hours_per_week = Column(DECIMAL(5,2))
    total_hours = Column(DECIMAL(5,2))


class TimeTable(TimeStampedBase):
    __tablename__ = "timetable"

    timetable_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section_id = Column(UUID(as_uuid=True), ForeignKey('sections.section_id'))
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    faculty_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    day_of_week = Column(Integer) # 1=Monday
    period_number = Column(Integer)
    start_time = Column(Time)
    end_time = Column(Time)
    # room_id would reference a Room model, omitting for brevity in this step
    timetable_type = Column(String(50))
    effective_from = Column(Date)
    effective_to = Column(Date)


class Attendance(TimeStampedBase):
    __tablename__ = "attendance"

    attendance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    section_id = Column(UUID(as_uuid=True), ForeignKey('sections.section_id'))
    attendance_date = Column(Date, nullable=False)
    period_number = Column(Integer)
    status = Column(String(20)) # PRESENT, ABSENT
    marked_by = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    remarks = Column(Text)


class AttendanceSummary(TimeStampedBase):
    __tablename__ = "attendance_summary"

    summary_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    academic_year = Column(String(10))
    semester = Column(Integer)
    total_classes = Column(Integer, default=0)
    classes_attended = Column(Integer, default=0)
    attendance_percentage = Column(DECIMAL(5,2))
