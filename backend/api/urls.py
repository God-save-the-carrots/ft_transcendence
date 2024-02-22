from django.urls import path, include

from .views import *
# from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', include('accounts.urls')),
    path('game/pong/', include('pong.urls')),
    path('token/refresh/', TokenRefreshView.as_view()),
]
