from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from accounts.models import UserRefreshToken


def validate_token(token, token_type='access'):
    try:
        if token_type == 'access':
            AccessToken(str(token)).verify()
        elif token_type == 'refresh':
            RefreshToken(str(token)).verify()
        else:
            raise ValueError("Unsupported token type")
        return True
    except TokenError:
        return False

class TokenValidationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            refresh_token_model = UserRefreshToken.objects.get(user_id=request.user)
            refresh_token = refresh_token_model.refresh_token
        except UserRefreshToken.DoesNotExist:
              return Response({"error": "User not found"}, status=404)

        access_token = request.auth

        refresh_token_result = validate_token(refresh_token, 'refresh')
        access_token_result = validate_token(access_token, 'access')

        if not access_token_result and not refresh_token_result:
            return Response({"error": "not logged in"}, status=401)

        elif not access_token_result and refresh_token_result or access_token_result and not refresh_token_result:
            refresh_token_model.delete()

            new_refresh_token = RefreshToken.for_user(request.user)
            new_refresh_token_model, created = UserRefreshToken.objects.get_or_create(user_id=request.user)

            new_refresh_token_model.refresh_token = str(new_refresh_token)
            new_refresh_token_model.save()

            access_token = new_refresh_token.access_token
            return Response({'access_token': str(access_token)}, status=201)

        return Response({"message": "Access Token is valid"}, status=200)


