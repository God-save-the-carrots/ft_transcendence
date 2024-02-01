from game.User import User
from game.Game import Game

class Tournament:
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        self.players = players
        self.game_constructor = game_constructor
        self.games = []
        
    async def start(self):
        pass
