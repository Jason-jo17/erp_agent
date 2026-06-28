from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID

class UserBase(BaseModel):
    username: str
    email: str
    mobile: Optional[str] = None
    user_type: str
    status: str = 'ACTIVE'

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: UUID
    model_config = ConfigDict(from_attributes=True)

class DepartmentBase(BaseModel):
    department_code: str
    department_name: str
    established_year: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    department_id: UUID
    model_config = ConfigDict(from_attributes=True)

class CourseBase(BaseModel):
    course_code: str
    course_name: str
    credits: int
    department_id: UUID

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    course_id: UUID
    model_config = ConfigDict(from_attributes=True)
