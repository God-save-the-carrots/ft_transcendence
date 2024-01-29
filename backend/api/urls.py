from django.urls import path, include

from .views import LoginAPIView, LogoutAPIView, UserAPIView, SocreAPIView, MatchesAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
    path('game/phong/score/<str:intra_id>/', SocreAPIView.as_view()),
    path('game/phong/matches/<int:match_id>/', MatchesAPIView.as_view()),
]
