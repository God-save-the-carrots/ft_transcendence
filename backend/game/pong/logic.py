from game.GameObject import GameObject, Vector2, Line

def rect_lines(rect:GameObject) -> 'list[Line]':
    up = rect.transform.rotation
    up *= rect.transform.scale.y * 0.5
    left = Vector2(-rect.transform.rotation.y, rect.transform.rotation.x)
    left = left * rect.transform.scale.x * 0.5
    return [
        Line(rect.transform.position + left + up, rect.transform.position - left + up),
        Line(rect.transform.position - left + up, rect.transform.position - left - up),
        Line(rect.transform.position - left - up, rect.transform.position + left - up),
        Line(rect.transform.position + left - up, rect.transform.position + left + up),
    ]

def pass_through(ray:Line, rect:GameObject) -> Vector2:
    res = []
    lines = rect_lines(rect)
    for line in lines:
        p1, p2, p3, p4 = (ray.start, ray.end, line.start, line.end)
        x1, x2, x3 = (p1.y - p2.y, p2.x - p1.x, p1.x*p2.y - p1.y*p2.x)
        y1, y2, y3 = (p3.y - p4.y, p4.x - p3.x, p3.x*p4.y - p3.y*p4.x)
        z1, z2, z3 = (x2*y3 - x3*y2, x3*y1 - x1*y3, x1*y2 - x2*y1)
        if z3 == 0:
            continue
        point = Vector2(z1/z3, z2/z3)
        if (point - ray.start).dot(ray.end - ray.start) < 0: # case back point
            continue
        if (point - line.start).dot(line.end - line.start) < 0: # case back point
            continue
        if ray.start.distance(point) > ray.start.distance(ray.end):
            continue
        if line.start.distance(point) > line.start.distance(line.end):
            continue
        v1 = (line.center - rect.transform.position).normalized()
        v2 = (ray.end - ray.start).normalized()
        if v1.dot(v2) >= 0:
            continue
        res.append((point, line))
    if len(res) == 0:
        return None
    return max(res, key=lambda x: ray.start.distance(x[0]))

def reflect(ball:GameObject, side:Line, rect:GameObject) -> Vector2:
    norm = rect.transform.rotation.normalized()
    if rect.tag == "player":
        direction = (side.center - rect.transform.position).normalized()
        if norm.dot(direction) > 0.9: # upside
            temp1 = (ball.transform.position - rect.transform.position).normalized()
            return (temp1 + norm * 1.1).normalized()
        else:
            norm = (ball.transform.position - rect.transform.position).normalized()
            vect = ball.acc.position
            return (vect - norm * vect.dot(norm) * 2).normalized()

    if rect.tag == "wall":
        vect = ball.acc.position
        return (vect - norm * vect.dot(norm) * 2).normalized()
    return None

def select_player_side_wall(player_objs:'list[GameObject]', walls:'list[GameObject]') -> GameObject:
    for wall in walls:
        for player_obj in player_objs:
            wall_normal = wall.transform.rotation
            player_normal = player_obj.transform.rotation
            if wall_normal.dot(player_normal) > 0.9:
                return player_obj
    return None

def get_owner(players, rect):
    func = lambda x: x.data.unit_id == rect.id
    owner = next((player for player in players if func(player)), None)
    return owner
