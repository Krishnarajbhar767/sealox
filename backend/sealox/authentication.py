import base64
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from rest_framework.authentication import BaseAuthentication, SessionAuthentication
from rest_framework import exceptions

TOKEN_SALT = 'sealox-admin-token'
TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 days


def generate_admin_token(user: User) -> str:
    """Generates a secure, cryptographically signed token for an admin user."""
    signer = TimestampSigner(salt=TOKEN_SALT)
    return signer.sign(user.username)


def verify_admin_token(token: str) -> User | None:
    """Verifies a signed admin token and retrieves the matching active staff user."""
    signer = TimestampSigner(salt=TOKEN_SALT)
    try:
        username = signer.unsign(token, max_age=TOKEN_MAX_AGE_SECONDS)
        user = User.objects.filter(username=username, is_active=True).first()
        if user and (user.is_staff or user.is_superuser):
            return user
        return None
    except (BadSignature, SignatureExpired):
        return None


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that skips CSRF validation for REST API calls
    originating from decoupled single-page application clients (e.g. React admin).
    """
    def enforce_csrf(self, request):
        return


class AdminTokenAuthentication(BaseAuthentication):
    """
    Decoupled Token authentication for Sealox Admin API.
    Accepts:
      - Authorization: Bearer <signed-token>
      - Authorization: Token <signed-token>
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2:
            return None

        auth_type, token = parts[0].lower(), parts[1]
        if auth_type not in ('bearer', 'token'):
            return None

        user = verify_admin_token(token)
        if not user:
            raise exceptions.AuthenticationFailed('Invalid or expired admin credentials/token.')

        return (user, token)
