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


class UserRefreshToken(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    refresh_token = models.CharField(max_length=512, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"RefreshToken for {self.user.intra_id}"


# profile : User와 1대1로 매칭이되는 정보 (변하는 정보)
class Profile(models.Model):
    KO = 'ko'
    EN = 'en'
    CN = 'cn'
    
    LANG_TYPE_CHOICES = [
        (KO, 'ko'),
        (EN, 'en'),
        (CN, 'cn'),
    ]

    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    photo_id = models.IntegerField(default=1)
    rating = models.IntegerField(default=1024)
    message = models.CharField(max_length=30, blank=True, null=True)
    lang_type = models.CharField(max_length=10, choices=LANG_TYPE_CHOICES, blank=True, default=EN)

    def __str__(self):
        return f"{self.user_id.intra_id} ({self.pk})"


