from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, intra_id, password=None, **extra_fields):
        if not intra_id:
            raise ValueError('The Intra ID must be set')
        
        user = self.model(intra_id=intra_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, intra_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(intra_id, password, **extra_fields)

# User : 유저의 정보 (바뀌지않는 정보)
class User(AbstractBaseUser, PermissionsMixin):
    intra_id = models.CharField(max_length=30, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'intra_id'

    def __str__(self):
        return f"{self.intra_id} ({self.pk})"


# profile : User와 1대1로 매칭이되는 정보 (변하는 정보)
class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    photo_id = models.IntegerField(default=1)
    rating = models.IntegerField(default=1024)
    message = models.CharField(max_length=30, blank=True, null=True)


