from .base import Base
from .user import User, Role, UserRole, Permission, role_permissions
from .academic import Department, Program, Course, Curriculum, Section, FacultyWorkload, TimeTable, Attendance, AttendanceSummary
from .exam import ExamSchedule, QuestionPaper, Result
from .finance import BudgetHead, FeeStructure, StudentFee, Vendor, PurchaseOrder
from .student_services import PlacementDrive, Internship, Grievance
from .research_compliance import ResearchProject, Publication, ComplianceCalendar, AQARData
