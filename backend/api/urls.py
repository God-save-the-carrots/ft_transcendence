from django.urls import path, include

from .views import LoginAPIView, LogoutAPIView, UserAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
]
