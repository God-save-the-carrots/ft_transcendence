from django.urls import path, include

from .views import *

urlpatterns = [
    path('', include('accounts.urls')),
    path('game/pong/', include('pong.urls')),
    path('token/validate', TokenValidationView.as_view()),
    path('token/access-granted', AccessGrantedView.as_view()),
    path('token/access-refreshed', AccessRefreshedView.as_view()),
    path('token/refresh-refreshed', RefreshRefreshedView.as_view()),
    path('token/both-expired', BothExpiredView.as_view()),
]
