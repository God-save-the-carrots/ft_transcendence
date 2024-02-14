from django.core.management.base import BaseCommand
from datetime import datetime
from django.utils import timezone
from accounts.models import User, Profile
from pong.models import Pong, GameSession, Tournament
import random

class Command(BaseCommand):
    help = 'Creates dummy data'

    def handle(self, *args, **options):
        # Create dummy users
        for i in range(1, 6):  # Adjust the range based on the number of dummy users you want
            user = User.objects.create(intra_id=f'dummy{i}')

            profile = Profile.objects.get(user_id=user.id)
            profile.rating = random.randint(800, 1500)
            profile.photo_id = random.randint(1, 8)
            profile.save()

        for i in range(1, 6):  # Adjust the range based on the number of dummy Tournaments you want
            tournament = Tournament.objects.create(game_type='pong_4')

            game_sessions = GameSession.objects.filter(tournament_id=tournament.id)

            for index in range(0, 3):
                if index == 0:
                    match_type = 'round_2'
                    end_time = timezone.make_aware(datetime(2024, 2, 11, 23, random.randint(21, 30), 0))
                    start_time = timezone.make_aware(datetime(2024, 2, 11, 23, 20, 0))

                    game_session = GameSession.objects.create(
                        tournament_id=tournament,
                        match_type=match_type,
                        start_time = start_time,
                        end_time = end_time
                    )

                    for index in range(0, 2):
                        first_player_user = User.objects.get(intra_id='dummy1')
                        second_player_user = User.objects.get(intra_id='dummy2')
                        if index == 0:
                            rank = 1
                            score = 10
                            user_id = first_player_user
                        else:
                            rank = 2
                            score = random.randint(1, 9)
                            user_id = second_player_user

                        pong = Pong.objects.create(
                            game_session_id=game_session,
                            user_id=user_id,
                            rank=rank,
                            score=score
                        )    
                else:
                    match_type = 'round_1'
                    end_time = timezone.make_aware(datetime(2024, 2, 11, 23, random.randint(21, 30), 0))
                    start_time = timezone.make_aware(datetime(2024, 2, 11, 23, 20, 0))

                    game_session = GameSession.objects.create(
                        tournament_id=tournament,
                        match_type=match_type,
                        start_time = start_time,
                        end_time = end_time
                    )

                    if index == 1:
                        first_player_rank = 1
                        second_player_rank = 3
                        first_player_user = User.objects.get(intra_id='dummy1')
                        second_player_user = User.objects.get(intra_id='dummy3')
                    else:
                        first_player_rank = 2
                        second_player_rank = 4
                        first_player_user = User.objects.get(intra_id='dummy2')
                        second_player_user = User.objects.get(intra_id='dummy4')

                    for index in range(0, 2):
                        if index == 0:
                            pong.rank = first_player_rank
                            pong.score = 10
                            pong.user_id = first_player_user
                        else:
                            pong.rank = second_player_rank
                            pong.score = random.randint(1, 9)
                            pong.user_id = second_player_user

                        pong = Pong.objects.create(
                            game_session_id=game_session,
                            user_id=user_id,
                            rank=rank,
                            score=score
                        )

        self.stdout.write(self.style.SUCCESS('Successfully created dummy data'))
