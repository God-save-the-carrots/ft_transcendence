import asyncio
from game.User import User
from game.Game import Game

class Tournament:
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        self.players = players
        self.game_constructor = game_constructor
        
    async def start(self):
        matchs = zip(*[iter(self.players)]*2)
        tasks = []
        while len(self.players) > 1:
            for match in matchs:
                players = [*match]
                game = self.game_constructor(players)
                tasks.append(asyncio.create_task(game.start()))
            results = await asyncio.gather(*tasks)

            for player in self.players:
                await player.send_json({"type":"next"})

            winners = [result.get("grade")[0] for result in results]
            self.players = winners

            losers = [result.get("grade")[1] for result in results]
            for loser in losers:
                await loser.send_json({"type":"close","reason":"loser"})
                await loser.socket.close()
