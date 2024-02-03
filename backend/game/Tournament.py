import asyncio
from game.Rule import Rule
from game.User import User
from game.Game import Game

class Tournament(Rule):
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        self.players = players
        self.game_constructor = game_constructor
        
    async def start(self):
        await self.step("start game", timer=1)
        winners = self.players
        while len(winners) > 1:
            await self.step("start round", timer=1)
            winners = await self.start_round(winners)
            await self.step("end round", timer=3)
        await self.step("end game", timer=1)
        await self.disconnect(self.players)

    async def start_round(self, players: 'list[User]') -> 'list[User]':
        matchs = zip(*[iter(players)]*2)
        tasks = []
        for match in matchs:
            players = [*match]
            game = self.game_constructor(players)
            tasks.append(asyncio.create_task(game.start()))
        results = await asyncio.gather(*tasks)

        losers = [result.get("grade")[1] for result in results]
        await self.broadcast(losers, {"type": "result", "result": "lose"})

        winners = [result.get("grade")[0] for result in results]
        await self.broadcast(winners, {"type": "result", "result": "win"})

        return winners
