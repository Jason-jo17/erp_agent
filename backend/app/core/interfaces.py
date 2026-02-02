from abc import ABC, abstractmethod
from typing import Dict, List, Any

class ERPConnector(ABC):
    """
    Abstract base class for ERP integrations.
    Supports: SAP, Oracle, Fedena, Campus Management, Custom ERP.
    """
    
    @abstractmethod
    def get_student_data(self, student_id: str) -> Dict[str, Any]:
        """Fetch student profile, enrollment, fees, attendance"""
        pass
    
    @abstractmethod
    def get_faculty_data(self, faculty_id: str) -> Dict[str, Any]:
        """Fetch faculty profile, qualifications, workload"""
        pass
    
    @abstractmethod
    def update_attendance(self, attendance_records: List[Dict]) -> bool:
        """Push attendance data to ERP"""
        pass
    
    @abstractmethod
    def get_financial_data(self, filters: Dict) -> Dict[str, Any]:
        """Pull financial reports, budgets, expenditure"""
        pass


class LMSConnector(ABC):
    """
    Abstract base class for LMS integrations.
    Supports: Moodle, Canvas, Blackboard, Google Classroom.
    """
    
    @abstractmethod
    def get_course_content(self, course_id: str) -> Dict[str, Any]:
        """Fetch course materials, modules, resources"""
        pass
    
    @abstractmethod
    def get_assignment_submissions(self, assignment_id: str) -> List[Dict]:
        """Fetch student submissions with timestamps"""
        pass
    
    @abstractmethod
    def sync_grades(self, grade_records: List[Dict]) -> bool:
        """Push grades from examination system to LMS"""
        pass
