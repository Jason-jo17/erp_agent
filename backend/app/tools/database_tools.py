from typing import List, Dict, Any, Optional
from sqlalchemy import select
from ..core.db_postgres import AsyncSessionLocal
from ..models.academic import Attendance, Course, AttendanceSummary
from ..models.user import User

class DatabaseTools:
    """Tools for interacting with the database."""
    
    async def fetch_attendance(self, student_id: str = None, course_id: str = None, date_range: Dict = None) -> List[Dict]:
        """Fetch attendance records."""
        async with AsyncSessionLocal() as session:
            stmt = select(Attendance)
            if student_id:
                stmt = stmt.where(Attendance.student_id == student_id)
            if course_id:
                stmt = stmt.where(Attendance.course_id == course_id)
            
            result = await session.execute(stmt)
            records = result.scalars().all()
            
            return [
                {
                    "attendance_id": str(r.attendance_id),
                    "student_id": str(r.student_id),
                    "course_id": str(r.course_id),
                    "date": str(r.attendance_date),
                    "status": r.status
                }
                for r in records
            ]
    
    async def get_student_data(self, student_id: str) -> Dict:
        """Fetch student details."""
        async with AsyncSessionLocal() as session:
            stmt = select(User).where(User.user_id == student_id, User.user_type == 'student')
            result = await session.execute(stmt)
            student = result.scalars().first()
            if student:
                return {
                    "id": str(student.user_id),
                    "name": student.username,
                    "email": student.email,
                    "mobile": student.mobile
                }
            return {}

    async def get_course_data(self, course_id: str) -> Dict:
        """Fetch course details."""
        async with AsyncSessionLocal() as session:
            stmt = select(Course).where(Course.course_id == course_id)
            result = await session.execute(stmt)
            course = result.scalars().first()
            if course:
                return {
                    "id": str(course.course_id),
                    "name": course.course_name,
                    "code": course.course_code,
                    "credits": course.credits,
                    "course_type": course.course_type
                }
            return {}

    async def fetch_students_below_attendance_threshold(self, course_id: str, threshold: float = 75.0) -> List[Dict]:
        """Identify students with low attendance."""
        async with AsyncSessionLocal() as session:
            stmt = select(AttendanceSummary).where(
                AttendanceSummary.course_id == course_id,
                AttendanceSummary.attendance_percentage < threshold
            )
            result = await session.execute(stmt)
            summaries = result.scalars().all()
            
            return [
                {
                    "student_id": str(s.student_id),
                    "attendance_percentage": float(s.attendance_percentage) if s.attendance_percentage else 0.0,
                    "total_classes": s.total_classes,
                    "classes_attended": s.classes_attended
                }
                for s in summaries
            ]
