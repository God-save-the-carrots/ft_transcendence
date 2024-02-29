from operator import attrgetter
from game.util import now
from game.Game import Game
from game.GameObject import GameObject, Vector2, Line
from game.pong import logic, map as pong_map
from game.User import User

class PongGame(Game):
    def __init__(self, players: 'list[User]'):
        Game.__init__(self, players, "pong_" + str(len(players)))
        self.init_countdown = 0.1
        self.wait_timer = 1
        self.players: list[User] = players
        self.onfinish = None

        (self.object_list, self.player_move_range) = pong_map.select_map(len(players))
        self.object_wall = self.filter_objects(lambda x: x.tag == "wall")
        self.player_objs = self.filter_objects(lambda x: x.tag == "player")
        self.player_start_pos = {}
        for player in self.player_objs:
            self.player_start_pos[player] = player.transform.position
        self.dynamic_objs = self.filter_objects(lambda x: x.tag == "player" or x.tag == "ball")
        self.rect_objs = self.filter_objects(lambda x: x.type == "rect")
        self.object_dict: dict[str, GameObject] = {}
        for obj in self.object_list:
            self.object_dict[obj.id] = obj
        self.ball = next(ob for ob in self.object_list if ob.tag == "ball")

        i = 0
        for user in players:
            user.push_onclose_event(self.onclose)
            user.push_onmessage_event(self.onmessage)
            user.data.unit_id = self.player_objs[i].id
            user.data.move = 0
            user.data.score = 0
            user.data.hit = 0
            i += 1

        self.player_speed = 18
        self.min_ball_speed = 20
        self.max_ball_speed = 25
        self.max_score = 3
        self.last_touch_player = self.players[0]
        self.start_time = None
        self.end_time = None

    async def start_first_frame(self):
        objects = list(map(lambda x: x.json(), self.object_list))
        players = []
        for user in self.players:
            players.append({
                "intra_id": user.intra_id,
                "unit_id": user.data.unit_id,
                "alias": user.alias,
            })
        init_data = {"type": "init", "objects": objects, "players": players}
        await self.broadcast(init_data)
        await self.broadcast_score()
        self.start_time = now()

    async def update(self, frame, delta):
        if all(not player.connected for player in self.players):
            return False

        self.move_player(delta)

        if self.is_end():
            for player_obj in self.player_objs:
                player_obj.set_acc(position=Vector2(0, 0))
                await self.broadcast_updated_data(self.player_objs)
            return False
        if await self.ready(delta):
            await self.broadcast_updated_data([])
            return True
        
        collided_objs = self.move_ball(delta)

        touched_wall_objs = (ob for ob in collided_objs if ob.tag == "wall")
        player_side_wall = logic.select_player_side_wall(self.player_objs, touched_wall_objs)
        if player_side_wall is not None:
            owner = logic.get_owner(self.players, player_side_wall)
            others = [player for player in self.players if player != owner]
            for other in others:
                other.data.score += 1
            self.init_countdown = 1
            self.ball.set_acc(position=Vector2(0, 0))
            await self.broadcast_score()

        touched_player_obj = next((ob for ob in collided_objs if ob.tag == "player"), None)
        if touched_player_obj is not None:
            self.min_ball_speed = min(self.min_ball_speed + 1, self.max_ball_speed)
            self.last_touch_player = logic.get_owner(self.players, touched_player_obj)
            self.last_touch_player.data.hit += 1

        await self.broadcast_updated_data(collided_objs)

        return True

    async def finish(self):
        self.end_time = now()
        if self.onfinish is not None:
            await self.onfinish(self, [{
                "intra_id": player.intra_id,
                "photo_id": player.photo_id,
                "alias": player.alias,
                "score": player.data.score,
                "hit": player.data.hit,
            } for player in self.players])

        for player in self.players:
            player.pop_onclose_event()
            player.pop_onmessage_event()

        sort_key = attrgetter("data.score")
        grade = sorted(iter(self.players), key=sort_key, reverse=True)
        return {
            "grade": grade
        }

    async def onmessage(self, user, json_data):
        if json_data["type"] == "move":
            user.data.move = json_data["data"]["move"] # 0, 1, -1
            unit = self.object_dict[user.data.unit_id]
            if user.data.move == 0:
                unit.set_acc(position=Vector2(0, 0))
            elif user.data.move == 1:
                unit = self.object_dict[user.data.unit_id]
                left = Vector2(-unit.transform.rotation.y, unit.transform.rotation.x)
                unit.set_acc(position=left*self.player_speed)
            elif user.data.move == -1:
                unit = self.object_dict[user.data.unit_id]
                right = Vector2(unit.transform.rotation.y, -unit.transform.rotation.x)
                unit.set_acc(position=right*self.player_speed)

    async def onclose(self, user):
        print("close", user)

    def filter_objects(self, test_func) -> 'list[GameObject]':
        return list(filter(test_func, self.object_list))

    def move_player(self, delta):
        for player in self.player_objs:
            center = self.player_start_pos[player]
            player.apply_acc(delta)
            pos = player.transform.position
            half_size = player.transform.scale.x * 0.5
            limit = self.player_move_range - half_size
            if center.distance(pos) > limit:
                fix = (pos - center).normalized() * limit
                player.transform.position = center + fix
                player.set_acc(position=Vector2(0, 0))

    def move_ball(self, delta):
        collided_objs = []
        candidates = []
        old_position, _, _ = self.ball.apply_acc(delta)

        for rect in self.rect_objs:
            current_position = self.ball.transform.position
            ray = Line(old_position, current_position)
            collision = logic.pass_through(ray, rect)
            if collision is None:
                continue
            (point, _) = collision
            distance = old_position.distance(point)
            if len(candidates) == 0:
                candidates.append((distance, collision, rect))
            elif distance > candidates[0][0] + 0.0001:
                continue
            elif distance > candidates[0][0] - 0.0001:
                candidates.append((distance, collision, rect))
            else:
                candidates = [(distance, collision, rect)]

        for candi in candidates:
            (_, (point, line), rect) = candi
            new_acc_pos = logic.reflect(self.ball, line, rect)
            self.ball.set_acc(position=new_acc_pos * self.min_ball_speed)
            self.ball.transform.position = point + new_acc_pos * 0.0001
            collided_objs.append(rect)

        return collided_objs

    def is_end(self):
        for player in self.players:
            if player.data.score == self.max_score:
                return True
        return False

    async def ready(self, delta):
        if self.init_countdown > 0:
            self.init_countdown -= delta
            if self.init_countdown <= 0:
                self.ball.transform.position = Vector2(0, 0)
                self.wait_timer = 1
                await self.synchronize()
            return True
        if self.wait_timer > 0:
            self.wait_timer -= delta
            if self.wait_timer <= 0:
                self.ball.set_acc(position=Vector2(1, 0)*self.min_ball_speed)
            return True
        return False

    async def synchronize(self):
        objects = list(map(lambda x: x.json(), self.dynamic_objs))
        await self.broadcast({"type": "sync", "objects": objects})

    async def broadcast_updated_data(self, collided_objs):
        debug = {}
        if len(collided_objs) != 0:
            debug["detected_wall_id"] = collided_objs[0].id

        changed = [(obj, obj.get_changed_acc_json()) for obj in self.dynamic_objs]
        changed = filter(lambda x: x[1], changed)
        changed = map(lambda x: {"id":x[0].id,"to":x[0].transform.json(),"acc":x[1]}, changed)
        changed = list(changed)

        if len(changed) != 0:
            await self.broadcast({
                "type": "update",
                "changed": changed,
                "debug": debug,
            })

    async def broadcast_score(self):
        scores = [{
            "unit_id": player.data.unit_id,
            "intra_id": player.intra_id,
            "alias": player.alias,
            "score": player.data.score,
        } for player in self.players]
        await self.broadcast({
            "type": "score",
            "score": scores,
        })
