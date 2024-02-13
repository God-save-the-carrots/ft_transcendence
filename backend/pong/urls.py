from django.urls import path, include

from .views import RankAPIView, MatchesAPIView

urlpatterns = [
    path('score/', include('score.urls')),
    path('rank/', RankAPIView.as_view()),
    path('matches/<int:match_id>/', MatchesAPIView.as_view()),
]