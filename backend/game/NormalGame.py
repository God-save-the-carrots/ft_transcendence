import asyncio
from game.Rule import Rule
from game.User import User
from game.Game import Game

class NormalGame(Rule):
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        Rule.__init__(self)
        self.players = players
        self.game_constructor = game_constructor
        self.game = None
        
    async def start(self):
        await self.step("start game", timer=1)
        await self.step("start round", timer=1)
        self.game = self.game_constructor(self.players)
        self.game.onfinish = self.endsession
        result = await self.game.start()
        await self.step("end round", timer=1)
        await self.step("end game", timer=1)

        losers = result.get("grade")[1:]
        await self.broadcast(losers, {"type": "result", "result": "lose"})

        winners = result.get("grade")[:1]
        await self.broadcast(winners, {"type": "result", "result": "win"})

        self.disconnect(self.players)

    async def endsession(self, game, players):
        await asyncio.sleep(1)
