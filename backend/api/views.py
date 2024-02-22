from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed

from accounts.models import UserRefreshToken

class AccessGrantedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Access granted"})


# def validate_token(token, token_type='access'):
#     try:
#         if token_type == 'access':
#             AccessToken(str(token)).verify()
#         elif token_type == 'refresh':
#             RefreshToken(str(token)).verify()
#         return True
#     except Exception:
#         return False

# class TokenValidationView(APIView):
#     permission_classes = [IsAuthenticated]

#     def dispatch(self, request, *args, **kwargs):
#         try:
#             response = super().dispatch(request, *args, **kwargs)
#             return response
#         except AuthenticationFailed as e:
#             return "HELLO!!"

#     def post(self, request):
#         refresh_token = request.data.get('refresh_token')
#         access_token = request.data.get('access_token')
#         if not refresh_token or not access_token:
#             return Response({"error": "Both refresh_token and access_token are required"}, status=status.HTTP_400_BAD_REQUEST)

#         refresh_token_result = validate_token(refresh_token, 'refresh')
#         access_token_result = validate_token(access_token, 'access')

#         if not access_token_result and not refresh_token_result:
#             return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

#         elif not access_token_result and refresh_token_result or access_token_result and not refresh_token_result:

#             new_refresh_token_model, created = UserRefreshToken.objects.get_or_create(user_id=request.user)
#             new_refresh_token = RefreshToken.for_user(request.user)
#             new_refresh_token_model.refresh_token = str(new_refresh_token)
#             new_refresh_token_model.save()

#             newt_access_token = new_refresh_token.access_token
#             response = {
#                 'access_token': str(newt_access_token),
#                 'refresh_token': str(new_refresh_token)
#             }
#             return Response(response, status=status.HTTP_201_CREATED)

#         return Response({"message": "Access Token is valid"}, status=status.HTTP_200_OK)
