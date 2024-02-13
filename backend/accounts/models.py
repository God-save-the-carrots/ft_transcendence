from django.contrib.auth.models import User
from django.db import models

# Create your models here.

# User : 유저의 정보 (바뀌지않는 정보)
class User(models.Model):
    intra_id = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.intra_id} ({self.pk})"


# profile : User와 1대1로 매칭이되는 정보 (변하는 정보)
class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    photo_id = models.IntegerField(default=1)
    rating = models.IntegerField(default=1024)
    message = models.CharField(max_length=30, blank=True, null=True)


