from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID
from app.core.db_postgres import get_db
from app.models.user import User
from app.models.academic import Department, Course
from app.schemas.crud_schemas import UserResponse, UserCreate, DepartmentResponse, DepartmentCreate, CourseResponse, CourseCreate
from app.core.security import get_password_hash
from app.core.rbac import rbac, Permission

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse], dependencies=[Depends(rbac.require_permission(Permission.MANAGE_USERS))])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.post("/users", response_model=UserResponse, dependencies=[Depends(rbac.require_permission(Permission.MANAGE_USERS))])
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        mobile=user_in.mobile,
        password_hash=get_password_hash(user_in.password),
        user_type=user_in.user_type,
        status=user_in.status
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.get("/departments", response_model=List[DepartmentResponse])
async def list_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department))
    return result.scalars().all()

@router.post("/departments", response_model=DepartmentResponse, dependencies=[Depends(rbac.require_permission(Permission.MANAGE_USERS))])
async def create_department(dept_in: DepartmentCreate, db: AsyncSession = Depends(get_db)):
    new_dept = Department(**dept_in.model_dump())
    db.add(new_dept)
    await db.commit()
    await db.refresh(new_dept)
    return new_dept

@router.get("/courses", response_model=List[CourseResponse])
async def list_courses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Course))
    return result.scalars().all()

@router.post("/courses", response_model=CourseResponse, dependencies=[Depends(rbac.require_permission(Permission.MANAGE_USERS))])
async def create_course(course_in: CourseCreate, db: AsyncSession = Depends(get_db)):
    new_course = Course(**course_in.model_dump())
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)
    return new_course
