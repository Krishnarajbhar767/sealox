from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that skips CSRF validation for REST API calls
    originating from decoupled single-page application clients (e.g. React admin).
    Authenticates request.user based on active session cookies without requiring
    an explicit X-CSRFToken header.
    """
    def enforce_csrf(self, request):
        return  # Bypass CSRF enforcement for API endpoints
