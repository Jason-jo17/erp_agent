from enum import Enum
from typing import List, Dict, Optional
from functools import wraps

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
        """Decorator for API endpoints or Agent methods"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Mock extracting user from context or args
                # In real app, this comes from Request -> User -> Role
                # For now, we assume 'context' dict is passed as argument or kwargs
                context = kwargs.get('context', {})
                user_role = context.get('role_id', 'student') # Default to lowest privilege
                
                if not RBAC.has_permission(user_role, permission):
                    raise PermissionError(f"User with role '{user_role}' lacks permission '{permission}'")
                
                return await func(*args, **kwargs)
            return wrapper
        return decorator

# Global Instance if needed, though static methods work fine
rbac = RBAC()
