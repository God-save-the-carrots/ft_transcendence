from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'Creates dummy users with intra_id set to "dummy"'

    def handle(self, *args, **options):
        # Create dummy users
        for i in range(1, 6):  # Adjust the range based on the number of dummy users you want
            User.objects.create(intra_id=f'dummy{i}')

        self.stdout.write(self.style.SUCCESS('Successfully created dummy users'))
