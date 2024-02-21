from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from jwt.exceptions import ExpiredSignatureError
from http import HTTPStatus
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.exceptions import AuthenticationFailed

from accounts.models import UserRefreshToken


def validate_token(token, token_type='access'):
    try:
        if token_type == 'access':
            AccessToken(str(token)).verify()
        elif token_type == 'refresh':
            RefreshToken(str(token)).verify()
        return True
    except Exception:
        return False

class TokenValidationView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        refresh_token = request.data.get('refresh_token', None)
        access_token = request.data.get('access_token', None)
        if refresh_token is None or access_token is None:
            return Response({"error": "Both refresh_token and access_token are required"}, status=400)

        access_token = request.auth

        refresh_token_result = validate_token(refresh_token, 'refresh')
        access_token_result = validate_token(access_token, 'access')

        if not access_token_result and not refresh_token_result:
            return Response({"error": "not logged in"}, status=401)

        elif not access_token_result and refresh_token_result or access_token_result and not refresh_token_result:

            new_refresh_token = RefreshToken.for_user(request.user)
            new_refresh_token_model, created = UserRefreshToken.objects.get_or_create(user_id=request.user)

            new_refresh_token_model.refresh_token = str(new_refresh_token)
            new_refresh_token_model.save()

            newt_access_token = new_refresh_token.access_token
            response = {
                'access_token': str(newt_access_token),
                'refresh_token': str(new_refresh_token)
            }
            return Response(response, status=201)

        return Response({"message": "Access Token is valid"}, status=200)
