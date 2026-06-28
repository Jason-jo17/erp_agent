import asyncio
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import text

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
load_dotenv()

from app.core.db_postgres import engine, AsyncSessionLocal
from app.models.base import TimeStampedBase
from app.models.user import User, Role
from app.core.security import get_password_hash

async def seed_data():
    print("Starting data seeding...")
    
    # Check if we should drop all tables first
    # This is a destructive operation! Only for demo/dev.
    async with engine.begin() as conn:
        print("Dropping existing tables...")
        await conn.run_sync(TimeStampedBase.metadata.drop_all)
        print("Creating tables...")
        await conn.run_sync(TimeStampedBase.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        # Create some demo roles
        print("Creating roles...")
        principal_role = Role(role_name="PRINCIPAL", role_description="College Principal")
        hod_cse_role = Role(role_name="HOD_CSE", role_description="Head of Computer Science Dept")
        faculty_role = Role(role_name="FACULTY", role_description="Faculty Member")
        student_role = Role(role_name="STUDENT", role_description="Student")
        
        session.add_all([principal_role, hod_cse_role, faculty_role, student_role])
        await session.commit()
        
        # Create users
        print("Creating users...")
        principal = User(
            username="principal",
            email="principal@college.edu",
            password_hash=get_password_hash("password123"),
            user_type="PRINCIPAL"
        )
        hod_cse = User(
            username="hod_cse",
            email="hod.cse@college.edu",
            password_hash=get_password_hash("password123"),
            user_type="HOD"
        )
        faculty = User(
            username="faculty_smith",
            email="smith@college.edu",
            password_hash=get_password_hash("password123"),
            user_type="FACULTY"
        )
        student = User(
            username="student_john",
            email="john@student.edu",
            password_hash=get_password_hash("password123"),
            user_type="STUDENT"
        )
        
        session.add_all([principal, hod_cse, faculty, student])
        await session.commit()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
