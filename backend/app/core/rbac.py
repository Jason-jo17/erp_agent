from enum import Enum
from typing import List, Dict, Optional
from functools import wraps
from fastapi import HTTPException, status, Depends
from app.models.user import User
# avoid circular import by importing locally later if needed
# from app.api.auth import get_current_user

class Role(str, Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    HOD = "hod"
    PRINCIPAL = "principal"
    ADMIN = "admin"
    PARENT = "parent"

class Permission(str, Enum):
    VIEW_OWN_PROFILE = "view:own_profile"
    VIEW_ALL_PROFILES = "view:all_profiles"
    EDIT_GRADES = "edit:grades"
    APPROVE_LEAVE = "approve:leave"
    GENERATE_REPORTS = "generate:reports"
    MANAGE_USERS = "manage:users"
    VIEW_ANALYTICS = "view:analytics"

# Role -> Permissions Mapping
ROLE_PERMISSIONS: Dict[Role, List[Permission]] = {
    Role.STUDENT: [Permission.VIEW_OWN_PROFILE],
    Role.FACULTY: [Permission.VIEW_OWN_PROFILE, Permission.EDIT_GRADES, Permission.VIEW_ANALYTICS],
    Role.HOD: [Permission.VIEW_ALL_PROFILES, Permission.EDIT_GRADES, Permission.APPROVE_LEAVE, Permission.VIEW_ANALYTICS],
    Role.PRINCIPAL: [Permission.VIEW_ALL_PROFILES, Permission.APPROVE_LEAVE, Permission.GENERATE_REPORTS, Permission.VIEW_ANALYTICS],
    Role.ADMIN: [p for p in Permission], # All permissions
    Role.PARENT: [Permission.VIEW_OWN_PROFILE] # Restricted view
}

class RBAC:
    @staticmethod
    def has_permission(user_role: str, required_permission: Permission) -> bool:
        try:
            role = Role(user_role.lower())
            return required_permission in ROLE_PERMISSIONS.get(role, [])
        except ValueError:
            return False

    @staticmethod
    def require_permission(permission: Permission):
        """Dependency for FastAPI endpoints"""
        from app.api.auth import get_current_user # imported here to avoid circular dep
        
        async def dependency(current_user: User = Depends(get_current_user)):
            user_role = current_user.user_type
            if not RBAC.has_permission(user_role, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"User with role '{user_role}' lacks permission '{permission}'"
                )
            return current_user
        return dependency

# Global Instance if needed, though static methods work fine
rbac = RBAC()
