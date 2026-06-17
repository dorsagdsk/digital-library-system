from rest_framework.permissions import BasePermission
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed

class RolePermissionBase(BasePermission):
    required_role = None  # باید در کلاس‌های فرزند تعریف شود

    def has_permission(self, request, view):
        token_key = request.COOKIES.get('auth_token')
        header = request.headers.get('Authorization')

        if header and header.startswith('Token '):
            token_key = header.split(' ')[1]

        if not token_key:
            return False

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            return getattr(user, 'role', None) == self.required_role
        except Token.DoesNotExist:
            raise AuthenticationFailed("توکن نامعتبر است")
        except Exception:
            return False

class IsAdminUserRole(RolePermissionBase):
    required_role = 'admin'

class IsCustomerRole(RolePermissionBase):
    required_role = 'customer'

class IsAuthorRole(RolePermissionBase):
    required_role = 'author'