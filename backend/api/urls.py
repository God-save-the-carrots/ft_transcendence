from django.urls import path, include

from .views import *

urlpatterns = [
    path('', include('accounts.urls')),
    path('game/pong/', include('pong.urls')),
    path('token/validate', TokenValidationView.as_view()),
]
