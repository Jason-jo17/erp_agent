import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import TimeStampedBase

# Association table for Many-to-Many Role-Permission
role_permissions = Table(
    'role_permissions',
    TimeStampedBase.metadata,
    Column('role_id', UUID(as_uuid=True), ForeignKey('roles.role_id'), primary_key=True),
    Column('permission_id', UUID(as_uuid=True), ForeignKey('permissions.permission_id'), primary_key=True)
)

class User(TimeStampedBase):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mobile = Column(String(15))
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(50), nullable=False) # PRINCIPAL, DEAN, HOD, FACULTY, STUDENT, ADMIN_STAFF
    status = Column(String(20), default='ACTIVE') # ACTIVE, INACTIVE, SUSPENDED
    last_login = Column(DateTime, nullable=True)

    # Relationships
    user_roles = relationship("UserRole", back_populates="user")
    
    # Simple direct access to roles if needed, though UserRole has extra data (dates)
    # roles = relationship("Role", secondary="user_roles", back_populates="users")


class Role(TimeStampedBase):
    __tablename__ = "roles"

    role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = Column(String(100), unique=True, nullable=False) # PRINCIPAL, HOD_CSE, etc.
    role_description = Column(Text)
    aicte_role_code = Column(String(50))
    hierarchy_level = Column(Integer) # 1=Principal, 2=Dean, 3=HOD, 4=Faculty
    reporting_to_id = Column(UUID(as_uuid=True), ForeignKey('roles.role_id'), nullable=True)

    # Relationships
    reporting_to = relationship("Role", remote_side=[role_id])
    subordinates = relationship("Role")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    user_roles = relationship("UserRole", back_populates="role")


class UserRole(TimeStampedBase):
    __tablename__ = "user_roles"

    user_role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    role_id = Column(UUID(as_uuid=True), ForeignKey('roles.role_id'))
    department_id = Column(UUID(as_uuid=True), ForeignKey('departments.department_id'), nullable=True)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=True)
    is_primary = Column(Boolean, default=True)

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")
    # Department relationship will be added in academic.py or via backref to avoid circular import issues at module level
    # or we define Department here if it's strictly User/Role related, but it's usually Academic. 
    # For now, we keep the ForeignKey string reference.


class Permission(TimeStampedBase):
    __tablename__ = "permissions"

    permission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    permission_name = Column(String(100), unique=True, nullable=False)
    resource = Column(String(100), nullable=False) # TIMETABLE, ATTENDANCE, EXAM
    action = Column(String(50), nullable=False) # CREATE, READ, UPDATE, DELETE, APPROVE
    description = Column(Text)

    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
