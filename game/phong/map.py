from engine.GameObject import GameObject
from engine.GameObject import Vector2
import math

def select_map(player_cnt):
    if player_cnt == 2:
        return player_2_map()
    if player_cnt == 3:
        return player_3_map()
    if player_cnt == 4:
        return player_4_map()


def player_2_map():
    object_list: list[GameObject] = []
    player_distance = 10

    for _ in range(0, 1):
        o = GameObject("ball", "circle")
        o.transform.position = Vector2(0, 0)
        o.transform.rotation = Vector2(1, 0)
        o.transform.scale = Vector2(1, 1)
        object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(-player_distance, 0)
    o.transform.rotation = Vector2(1, 0)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(player_distance, 0)
    o.transform.rotation = Vector2(-1, 0)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # left
    o.transform.position = Vector2(-(player_distance + 2), 0)
    o.transform.rotation = Vector2(1, 0)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # right
    o.transform.position = Vector2((player_distance + 2), 0)
    o.transform.rotation = Vector2(-1, 0)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # up
    o.transform.position = Vector2(0, (player_distance + 2))
    o.transform.rotation = Vector2(0, -1)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # down
    o.transform.position = Vector2(0, -(player_distance + 2))
    o.transform.rotation = Vector2(0, 1)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    return object_list

def player_3_map():
    deg30 = math.pi / 6
    root3 = math.sqrt(3)
    player_distance = 12
    object_list: list[GameObject] = []

    for _ in range(0, 1):
        o = GameObject("ball", "circle")
        o.transform.position = Vector2(0, 0)
        o.transform.rotation = Vector2(1, 0)
        o.transform.scale = Vector2(1, 1)
        object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(math.cos(deg30 * 9), math.sin(deg30 * 9)) * player_distance
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(math.cos(deg30 * 5), math.sin(deg30 * 5)) * player_distance
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(math.cos(deg30 * 1), math.sin(deg30 * 1)) * player_distance
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # left
    o.transform.position = Vector2(math.cos(deg30 * 5), math.sin(deg30 * 5)) * (player_distance + 2)
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(player_distance * root3 * 1.3, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # right
    o.transform.position = Vector2(math.cos(deg30 * 1), math.sin(deg30 * 1)) * (player_distance + 2)
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(player_distance * root3 * 1.3, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # down
    o.transform.position = Vector2(math.cos(deg30 * 9), math.sin(deg30 * 9)) * (player_distance + 2)
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(player_distance * root3 * 1.3, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # left-right
    o.transform.position = Vector2(math.cos(deg30 * 3), math.sin(deg30 * 3)) * player_distance * 1.55
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(11.5, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # right-down
    o.transform.position = Vector2(math.cos(deg30 * 7), math.sin(deg30 * 7)) * player_distance * 1.55
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(11.5, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # down-left
    o.transform.position = Vector2(math.cos(deg30 * 11), math.sin(deg30 * 11)) * player_distance * 1.55
    o.transform.rotation = (-o.transform.position).normalized()
    o.transform.scale = Vector2(11.5, 1)
    object_list.append(o)

    return object_list

def player_4_map():
    object_list: list[GameObject] = []
    player_distance = 15

    for _ in range(0, 1):
        o = GameObject("ball", "circle")
        o.transform.position = Vector2(0, 0)
        o.transform.rotation = Vector2(1, 0)
        o.transform.scale = Vector2(1, 1)
        object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(-player_distance, 0)
    o.transform.rotation = Vector2(1, 0)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(player_distance, 0)
    o.transform.rotation = Vector2(-1, 0)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(0, -player_distance)
    o.transform.rotation = Vector2(0, 1)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("player", "rect")
    o.transform.position = Vector2(0, player_distance)
    o.transform.rotation = Vector2(0, -1)
    o.transform.scale = Vector2(5, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # left
    o.transform.position = Vector2(-(player_distance + 2), 0)
    o.transform.rotation = Vector2(1, 0)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # right
    o.transform.position = Vector2((player_distance + 2), 0)
    o.transform.rotation = Vector2(-1, 0)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # up
    o.transform.position = Vector2(0, (player_distance + 2))
    o.transform.rotation = Vector2(0, -1)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    o = GameObject("wall", "rect") # down
    o.transform.position = Vector2(0, -(player_distance + 2))
    o.transform.rotation = Vector2(0, 1)
    o.transform.scale = Vector2((player_distance + 2) * 2 + 1, 1)
    object_list.append(o)

    return object_list
