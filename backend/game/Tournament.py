import asyncio
import json
from game.Rule import Rule
from game.User import User
from game.Game import Game
from game.util import now, post_data

class Tournament(Rule):
    def __init__(self, players: 'list[User]', game_constructor: Game) -> None:
        Rule.__init__(self)
        self.players = players
        self.game_constructor = game_constructor
        self.results = []

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
        await self.save_result()

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
        self.results.append({
            "match": game.tag[:7],
            "scores": [{
                "intra_id": player["intra_id"],
                "score": player["score"],
            } for player in players],
            "start_time": game.start_time,
            "end_time": game.end_time,
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

    async def save_result(self):
        grades = [{
            "intra_id": score["intra_id"],
            "score": score["score"],
            "time": res["end_time"] - res["start_time"],
        } for res in self.results for score in res["scores"]]
        sum = {}
        for grade in grades:
            intra_id = grade["intra_id"]
            if intra_id not in sum:
                sum[intra_id] = {"intra_id": intra_id, "score": 0, "time": 0}
            sum[intra_id]["score"] += grade["score"]
            sum[intra_id]["time"] += grade["time"]
        key = lambda x: (x["score"], x["time"])
        sorted_grades = sorted(sum.values(), key=key, reverse=True)
        sorted_players = [{
            "intra_id": value["intra_id"],
            "grade": index + 1,
        } for index, value in enumerate(sorted_grades)]

        sorted_games = sorted(self.results, key=lambda x: x["match"], reverse=True)

        save_data = json.dumps({
            "games": sorted_games,
            "players": sorted_players,
        })
        url = "http://localhost:8000/api/game/pong/" # TODO: use env
        if await post_data(url, save_data) is None:
            print("failed to store game result")
