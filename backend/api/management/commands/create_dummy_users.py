from django.core.management.base import BaseCommand
from accounts.models import User, Profile
import random

class Command(BaseCommand):
    help = 'Creates dummy users'

    def handle(self, *args, **options):
        # Create dummy users
        for i in range(1, 6):  # Adjust the range based on the number of dummy users you want
            user = User.objects.create(intra_id=f'dummy{i}')

            profile = Profile.objects.get(user_id=user.id)
            profile.rating = random.randint(800, 1500)
            profile.photo_id = random.randint(1, 8)
            profile.save()

        self.stdout.write(self.style.SUCCESS('Successfully created dummy users'))