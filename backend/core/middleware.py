# myapp/middleware.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class SimpleJWTTokenUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        jwt_auth = JWTAuthentication()
        user, _ = jwt_auth.authenticate(request)

        if user:
            request.user = user
        else:
            # 토큰 갱신
            refresh = TokenObtainPairSerializer.get_token(user)
            request.COOKIES['access_token'] = str(refresh.access_token)

        response = self.get_response(request)
        return response