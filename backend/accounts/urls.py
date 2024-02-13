from django.urls import path

from .views import *

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
]
