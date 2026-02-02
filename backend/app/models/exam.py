import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, Time, Text, DECIMAL, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import TimeStampedBase

class ExamSchedule(TimeStampedBase):
    __tablename__ = "exam_schedules"

    exam_schedule_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    academic_year = Column(String(10), nullable=False)
    semester = Column(Integer, nullable=False)
    exam_type = Column(String(50)) # MID_SEM_1, MID_SEM_2, END_SEM
    exam_date = Column(Date, nullable=False)
    start_time = Column(Time)
    end_time = Column(Time)
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    max_marks = Column(Integer)
    duration_minutes = Column(Integer)
    question_paper_code = Column(String(50))
    published_date = Column(Date)

    course = relationship("Course")


class QuestionPaper(TimeStampedBase):
    __tablename__ = "question_papers"

    question_paper_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_schedule_id = Column(UUID(as_uuid=True), ForeignKey('exam_schedules.exam_schedule_id'))
    paper_set = Column(String(10)) # SET_A, SET_B
    prepared_by = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    moderated_by = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    paper_file_path = Column(Text)
    status = Column(String(50)) # DRAFT, SUBMITTED, APPROVED

    exam_schedule = relationship("ExamSchedule")


class Result(TimeStampedBase):
    __tablename__ = "results"

    result_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.course_id'))
    academic_year = Column(String(10))
    semester = Column(Integer)
    internal_marks = Column(DECIMAL(5,2))
    external_marks = Column(DECIMAL(5,2))
    total_marks = Column(DECIMAL(5,2))
    grade = Column(String(5))
    credits_earned = Column(Integer)
    result_status = Column(String(50)) # PASS, FAIL
    sgpa = Column(DECIMAL(4,2))
    cgpa = Column(DECIMAL(4,2))
    published_at = Column(Date)
