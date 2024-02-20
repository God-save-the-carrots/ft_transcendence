from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponseForbidden, HttpResponseNotFound
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

import requests
from django.conf import settings
from django.shortcuts import redirect
from urllib.parse import urlencode

# TODO : Token 관련 View들 추가 작업필요.

# Token의 상태를 보는 View
class TokenValidationView(APIView):
	permission_classes = [IsAuthenticated]
	
	def get(self, request):
		return Response({"message": "Access Token is valid"})

class AccessGrantedView(APIView):
	permission_classes = [IsAuthenticated]
	
	def get(self, request):
		pass

class AccessRefreshedView(APIView):
	permission_classes = [IsAuthenticated]
	
	def get(self, request):
		pass

class RefreshRefreshedView(APIView):
	permission_classes = [IsAuthenticated]
	
	def get(self, request):
		pass

class BothExpiredView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request):
		pass



