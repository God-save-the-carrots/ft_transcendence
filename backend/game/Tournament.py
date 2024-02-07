import asyncio
from game.Rule import Rule
from game.User import User
from game.Game import Game
from game.util import now

class Tournament(Rule):
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        Rule.__init__(self)
        self.players = players
        self.game_constructor = game_constructor
        
    async def start(self):
        await self.step("start game", timer=1)
        winners = self.players
        i = 0
        while len(winners) > 1:
            i += 1
            await self.step("start round", timer=1)
            winners = await self.start_round(i, winners)
            await self.step("end round", timer=3)
        await self.step("end game", timer=1)
        await self.disconnect(self.players)

    async def start_round(self, round, players: 'list[User]') -> 'list[User]':
        matchs = zip(*[iter(players)]*2)
        tasks = []
        i = 0
        for match in matchs:
            i += 1
            players = [*match]
            game = self.game_constructor(players)
            game.tag = "round_" + str(round) + "_" + str(i)
            game.onfinish = self.endsession
            tasks.append(asyncio.create_task(game.start()))
        results = await asyncio.gather(*tasks)

        losers = [result.get("grade")[1] for result in results]
        await self.broadcast_result(losers, {"result": "lose"})

        winners = [result.get("grade")[0] for result in results]
        await self.broadcast_result(winners, {"result": "win"})

        return winners

    async def endsession(self, game, players):
        await self.broadcast_info({
            "cause": "end_session",
            "play_time": now() - game.start_at,
            "tag": game.tag,
            "result": players,
        })
        await asyncio.sleep(1)

    async def broadcast_result(self, targets, data):
        send_data = {"type": "result"}
        send_data.update(data)
        await self.broadcast(targets, send_data)

    async def broadcast_info(self, data):
        send_data = {"type": "info"}
        send_data.update(data)
        await self.broadcast(self.players, send_data)
