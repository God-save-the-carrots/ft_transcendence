from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserRefreshToken, Profile
from .serializers import *
from rest_framework import status

import requests
from django.conf import settings
from django.shortcuts import redirect
from urllib.parse import urlencode

# Create your views here.

# login
class LoginAPIView(APIView):

    def post(self, request):
        client_id = settings.CLIENT_ID
        client_secret = settings.CLIENT_SECRET
        redirect_uri = settings.REDIRECT_URI

        code = request.data.get('code', None)
        if code is None:
            return Response({"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)

        token = requests.post('https://api.intra.42.fr/oauth/token', data={
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
            'code': code,
        })
        if token.status_code != 200:
            return Response({"error": "Failed to get token"}, status=status.HTTP_404_NOT_FOUND)

        token_serializer = TokenSerializer(data=token.json())
        if not token_serializer.is_valid():
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        me = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f"Bearer {token.json()['access_token']}"})
        if me.status_code != 200:
            return Response({"error": "Failed to get 42 info"}, status=status.HTTP_400_BAD_REQUEST)
        user_info = me.json()
        user_instance_model, created = User.objects.get_or_create(intra_id=user_info['login'])

        refresh_token = TokenObtainPairSerializer.get_token(user_instance_model)
        refresh_token['intra_id'] = user_instance_model.intra_id
        access_token = refresh_token.access_token

        refresh_token_model, created = UserRefreshToken.objects.get_or_create(user_id=user_instance_model)
        refresh_token_model.refresh_token = str(refresh_token)
        refresh_token_model.save()
        response = {
            "intra_id": user_instance_model.intra_id,
            "access": str(access_token),
            "refresh": str(refresh_token)
        }
        print(response) # debug
        return Response(response, status=status.HTTP_200_OK)

# logout
class LogoutAPIView(APIView):
    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)

# user/<str:intra_id>/
class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, intra_id):
        try:
            user_model = User.objects.get(intra_id=intra_id)
            serializer = CustomUserSerializer(user_model)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, intra_id):
        if str(request.user.intra_id) != intra_id:
            return Response({"error": "Permission denied. You can only update your own profile."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user_instance = User.objects.get(intra_id=intra_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            profile_instance = user_instance.profile
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        if 'photo_id' in request.data:
            profile_instance.photo_id = request.data['photo_id']
        if 'message' in request.data:
            profile_instance.message = request.data['message']
    
        profile_instance.save()

        serializer = CustomUserSerializer(user_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)