from game.GameObject import GameObject, Vector2, Line

def rect_line(rect:GameObject) -> Line:
    up = rect.transform.rotation
    up *= rect.transform.scale.y * 0.5
    left = Vector2(-rect.transform.rotation.y, rect.transform.rotation.x)
    left = left * rect.transform.scale.x * 0.5
    return Line(rect.transform.position + left + up, rect.transform.position - left + up)

def pass_through(ray:Line, rect:GameObject) -> Vector2:
    line = rect_line(rect)
    p1, p2, p3, p4 = (ray.start, ray.end, line.start, line.end)
    x1, x2, x3 = (p1.y - p2.y, p2.x - p1.x, p1.x*p2.y - p1.y*p2.x)
    y1, y2, y3 = (p3.y - p4.y, p4.x - p3.x, p3.x*p4.y - p3.y*p4.x)
    z1, z2, z3 = (x2*y3 - x3*y2, x3*y1 - x1*y3, x1*y2 - x2*y1)
    if z3 == 0:
        return None
    res = Vector2(z1/z3, z2/z3)
    if (res - ray.start).dot(ray.end - ray.start) < 0: # case back point
        return None
    if (res - line.start).dot(line.end - line.start) < 0: # case back point
        return None
    if ray.start.distance(res) > ray.start.distance(ray.end):
        return None
    if line.start.distance(res) > line.start.distance(line.end):
        return None
    return res

def reflect(ball:GameObject, rect:GameObject, speed:float) -> Vector2:
    if rect.tag == "player":
        temp1 = (ball.transform.position - rect.transform.position).normalized()
        direction = (temp1 + rect.transform.rotation * 1.1).normalized()
        return direction * speed

    if rect.tag == "wall":
        norm = rect.transform.rotation
        vect = ball.acc.position
        return vect - norm * vect.dot(norm) * 2
    return None
