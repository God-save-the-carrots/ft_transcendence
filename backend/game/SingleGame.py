from game.User import User
from game.Game import Game

class SingleGame:
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        self.players = players
        self.game_constructor = game_constructor
        self.game = None
        
    async def start(self):
        self.game = self.game_constructor(self.players)
        result = await self.game.start()
        for player in self.players:
            await player.send_json({
                "type": "end",
                "result": {} # TODO: send result
            })
        print("single game result: ", result)
