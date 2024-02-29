from django.urls import path, include

from .views import PongAPIView, RankAPIView, MatchesAPIView, TicketAPIView

urlpatterns = [
    path('score/', include('score.urls')),
    path('', PongAPIView.as_view()),
    path('rank/', RankAPIView.as_view()),
    path('matches/<int:match_id>/', MatchesAPIView.as_view()),
    path('ticket/', TicketAPIView.as_view()),
]