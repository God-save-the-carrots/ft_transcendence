from django.contrib import admin
from .models import User, Profile, Tournament, GameSession, Pong

# Register your models here.

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Tournament)
admin.site.register(GameSession)
admin.site.register(Pong)
