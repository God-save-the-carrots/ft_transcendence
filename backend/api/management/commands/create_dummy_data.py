from django.core.management.base import BaseCommand
from datetime import datetime
from accounts.models import User, Profile
from pong.models import Pong, GameSession, Tournament
import random

class Command(BaseCommand):
    help = 'Creates dummy'

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

            for index, game_session in enumerate(game_sessions):
                if index == 0:
                    game_session.match_type = 'round_2'

                    pongs = Pong.objects.filter(game_session_id=game_session.id)
                    for index, pong in enumerate(pongs):
                        first_player_user = User.objects.get(intra_id='dummy1')
                        second_player_user = User.objects.get(intra_id='dummy2')
                        if index == 0:
                            pong.rank = 1
                            pong.score = 10
                            pong.user_id = first_player_user
                        else:
                            pong.rank = 2
                            pong.score = random.randint(1, 9)
                            pong.user_id = second_player_user
                        pong.save()
                else:
                    game_session.match_type = 'round_1'

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
                    
                    pongs = Pong.objects.filter(game_session_id=game_session.id)
                    for index, pong in enumerate(pongs):
                        if index == 0:
                            pong.rank = first_player_rank
                            pong.score = 10
                            pong.user_id = first_player_user
                        else:
                            pong.rank = second_player_rank
                            pong.score = random.randint(1, 9)
                            pong.user_id = second_player_user
                        pong.save()

                game_session.end_time = datetime(2024, 2, 11, 23, random.randint(21, 30), 0)
                game_session.start_time = datetime(2024, 2, 11, 23, 20, 0)

                game_session.save()

        self.stdout.write(self.style.SUCCESS('Successfully created dummy'))
