#!/usr/bin/env python3
import sys, traceback

sys.stdout = sys.stderr

_DIRECTION_CHARS = ["ne", "se", "s", "so", "no", "n"]
_PANDA_CHARS = ["A", "B", "X", "Y"]
_BABY_PANDA_CHARS = ["C", "Z"]
_BRIDGE_SIGN_CHARS = ["+", "-"]


def main() -> int:
    # read stdin
    map_str: str = sys.stdin.read()
    # check num lines
    num_lines: int = map_str.split("\n", 1).__len__()
    if num_lines < 2:
        print(f"Il y a moins de 2 lignes: {num_lines}")
        return 1
    # extract width & height
    splitted_map = map_str.split("\n", 1)
    first_line = splitted_map[0].split(" ")
    first_line = list(filter(None, first_line))
    if len(first_line) < 2:
        print('Format "largeur hauteur" invalid')
        return 1
    try:
        width, height = int(first_line[0]), int(first_line[1])
    except ValueError:
        print("La longeur et la hauteur doivent être des nombres")
        return 1
    # fill map
    raw_map_str = splitted_map[1]
    num_chars = len(raw_map_str)
    if num_chars < 4 * width * height - 1:
        print(
            f"Il n'y a pas assez de caractères littéraux pour former une map de {width}x{height} dans le fichier: {num_chars} < {4 * width * height - 1}"
        )
        return 1
    # check presence of basics
    for panda_char in _PANDA_CHARS:
        panda_char_count = raw_map_str.count(panda_char)
        if panda_char_count != 1:
            if panda_char_count == 0:
                print(f"Manque panda: {panda_char}:")
                return 1
            else:
                print(
                    f"Trop de pandas du même type: {panda_char_count} fois {panda_char}"
                )
                return 1
    # init vars
    map_: list[list[dict]] = [[None for _ in range(width)] for _ in range(height)]
    buffer: str = ""
    x, y = 0, 0
    # get all tiles
    for i, c in enumerate(raw_map_str):
        # buffer finished ?
        if c != " " and c != "\n":
            buffer += c
            if len(buffer) != 3 or i != num_chars - 1:
                continue

        # trailing whitespace after map is finished ?

        # add tile buffer to map
        success, tile_dict = _addtilebuffer(buffer, x, y)
        if not success:
            print(f"Case invalide: {buffer} à {x},{y}")
            return 1
        map_[y][x]: dict = tile_dict
        buffer = ""

        # next coords
        if (x := x + 1) == width:
            x = 0
            y += 1

    # check map alltogether (bridge connections etc.)
    return_code = _checkmap(map_, width, height)
    if return_code != 0:
        print(f"Vérification de carte non réussie. Code de retour: {return_code}")

    # done.
    return return_code


def _addtilebuffer(buffer: str, x: int, y: int) -> tuple[bool, dict]:
    # basic length check
    if len(buffer) != 3:
        print(f"Longueur de case invalide: {buffer}")
        return False, None

    # either panda/bridge, bridge or baby panda
    tile_dict = {
        "x": x,
        "y": y,
        "water": False,
        "player": None,
        "panda": None,
        "baby panda": None,
        "bridge": None,
        "id": None,
        "obstacle": False,
    }

    # water tile easy check
    if "_" in buffer:
        if buffer != "___":
            print(
                f'Ne peut pas avoir le caractère "_" dans une case si elle n\'est pas "___": {buffer}'
            )
            return False, None
        else:
            tile_dict["water"] = True
            return True, tile_dict
    if "#" in buffer:
        if buffer != "###":
            print(
                f'Ne peut pas avoir le caractère "#" dans une case si elle n\'est pas "###": {buffer}'
            )
            return False, None
        else:
            tile_dict["obstacle"] = True
            return True, tile_dict

    # panda/bridge
    if buffer[0] in _PANDA_CHARS:
        player = "1" if buffer[0] in _PANDA_CHARS[:2] else "2"
        # add panda
        tile_dict["player"] = player
        tile_dict["panda"] = buffer[0]
        # try and convert value & direction
        try:
            value = int(buffer[1])
            direction = int(buffer[2])
        except Exception as e:
            print(
                f"La conversion en nombre entier de {buffer[1]} ou de {buffer[2]} a échoué pour la case {buffer}. Erreur causée: {e}"
            )
            return False, None
        # check value & direction values
        if not 0 < value < 7:
            print(f"Valeur invalide (doit être dans [1-6]): {value}")
            return False, None
        if not 0 < direction < 7:
            print(f"Direction invalide (doit être dans [1-6]): {direction}")
            return False, None
        # add bridge
        tile_dict["bridge"] = {
            "value": value,
            "direction": direction,
            "sign": "?",
            "connected": False,
        }
        return True, tile_dict

    # bridge
    if buffer[0] in _BRIDGE_SIGN_CHARS:
        sign = buffer[0]
        # try and convert value & direction
        try:
            value = int(buffer[1])
            direction = int(buffer[2])
        except Exception as e:
            print(
                f"La conversion en nombre entier de {buffer[1]} ou de {buffer[2]} a échoué pour la case {buffer}. Erreur causée: {e}"
            )
            return False, None
        # check value & direction values
        if not 0 < value < 7:
            print(f"Valeur invalide (doit être dans [1-6]): {value}")
            return False, None
        if not 0 < direction < 7:
            print(f"Direction invalide (doit être dans [1-6]): {direction}")
            return False, None
        # add bridge
        tile_dict["bridge"] = {
            "value": value,
            "direction": direction,
            "sign": sign,
            "connected": False,
        }
        return True, tile_dict

    # baby
    if buffer[0] in _BABY_PANDA_CHARS:
        player = "1" if buffer[0] == _BABY_PANDA_CHARS[0] else "2"
        # try and convert baby panda id
        try:
            id_ = int(buffer[1:])
        except Exception as e:
            print(
                f'Convertion de l\'id "{buffer[1:]}" en nombre entier a échoué. Erreur causée: {e}'
            )
            return False, None
        # add baby panda
        tile_dict["player"] = player
        tile_dict["baby panda"] = buffer[0]
        tile_dict["id"] = id_
        return True, tile_dict

    print(f'Premier caractère de case inconnu: "{buffer[0]}". La case est "{buffer}"')
    return False, None


def _checkmap(map_: list[list[dict]], width: int, height: int) -> int:
    # check that all the tiles are dicts
    if not all([type(d) == dict for line in map_ for d in line]):
        print(f"Certains éléments ne sont pas des dicionnaires: {map_}")
        return 1
    # check all tiles individually
    for y in range(height):
        for x in range(width):
            tile = map_[y][x]
            # water
            if tile["water"] or tile["obstacle"]:
                continue
            # panda/bridge
            elif tile["panda"]:
                # check that bridge is not pointing towards water
                return_code: int = _validate_bridge(tile, (x, y), map_, width, height)
                if return_code != 0:
                    return return_code
            elif tile["bridge"]:
                # check that bridge is not pointing towards water
                return_code: int = _validate_bridge(tile, (x, y), map_, width, height)
                if return_code != 0:
                    return return_code
            elif tile["baby panda"]:
                baby_panda_owner_plyer = tile["player"]
                for direction_str in _DIRECTION_CHARS:
                    # one of the surrounding positions
                    neighbour_pos = _new_pos_by_direction((x, y), direction_str)
                    # next iteration if invalid position
                    if not _is_valid_position(neighbour_pos, width, height):
                        continue
                    # there should not be a panda belonging to same player as baby on surrounding tile
                    # reminder: pandas take babies when they are next to them
                    if (
                        map_[neighbour_pos[1]][neighbour_pos[0]]["panda"]
                        and map_[neighbour_pos[1]][neighbour_pos[0]]["player"]
                        == baby_panda_owner_plyer
                    ):
                        print(
                            f"Il y a un panda ({neighbour_pos}) de la même race/équipe que le bébé panda ({(x,y)}) sur une case adjacente.\nLes bébés pandas environnants auraient dû être ramassés"
                        )
                        return 1
            else:
                # it is not water, not a panda/bridge, not a bridge and not a baby pada. What is it ?
                print(f"Type de case inconnu à {(x,y)}: {tile}")
                return 1

    if not all(
        [
            tile["bridge"]["connected"]
            for line in map_
            for tile in filter(lambda tile: tile["bridge"], line)
        ]
    ):
        return 1

    return 0


def _validate_bridge(
    tile: dict, pos: tuple[int], map_: list[list[dict]], width: int, height: int
) -> int:
    # there should be a bridge ...
    if tile["bridge"] == None:
        print(f"Vérification de pont: Il n'y a pas de pont: {tile}")
        return 1

    # already checked
    if tile["bridge"]["connected"]:
        return 0

    # unlinked sign
    if tile["bridge"]["sign"] == "?":
        return 0

    # position the bridge is pointing to
    neighbour_bridge_pos = _new_pos_by_direction(
        pos, _direction_str_from_int(tile["bridge"]["direction"])
    )
    if not _is_valid_position(neighbour_bridge_pos, width, height):
        print(
            f"Le pont: {pos} pointe vers une position hors de la carte: {neighbour_bridge_pos}"
        )
        return 1

    # get the partner bridge
    other = map_[neighbour_bridge_pos[1]][neighbour_bridge_pos[0]]
    if other["bridge"] == None:
        print(
            f"Case de pont: {pos} -> {tile}\nne pointe pas vers un autre pont:\nautre: {neighbour_bridge_pos} -> {other}"
        )
        return 1

    # check if other bridge pointing towards this bridge
    neighbour_bridge_pointing_to_pos = _new_pos_by_direction(
        neighbour_bridge_pos, _direction_str_from_int(other["bridge"]["direction"])
    )
    if neighbour_bridge_pointing_to_pos != pos:
        print(
            f"Autre pont {other} ne pointe pas vers le pont présent: {tile}, mais il pointe vers {neighbour_bridge_pointing_to_pos}"
        )
        return 1

    # connect both
    tile["bridge"]["connected"] = True
    other["bridge"]["connected"] = True

    # sign matching
    if tile["bridge"]["sign"] != "?":
        if tile["bridge"]["sign"] == other["bridge"]["sign"]:
            print(
                f"Ces ponts sont connectés entre eux mais ont le même signe:\ncase: {tile}\nautre: {other}"
            )
            return 1
        elif other["bridge"]["sign"] == "?":
            other["bridge"]["sign"] = "+" if tile["bridge"]["sign"] == "-" else "-"
    else:
        if other["bridge"]["sign"] == "?":
            print(
                "Deux ponts connectés ont des signes inconnus (un panda est sur eux):\npont: {tile}\nautre: {other}"
            )
            return 1
        else:
            tile["bridge"]["sign"] = "+" if other["bridge"]["sign"] == "-" else "-"

    return 0


def _new_pos_by_direction(pos: tuple[int], direction_str: str) -> tuple[int]:
    x, y = pos
    nx, ny = -1, -1  # 'nx' is 'new x' & 'ny' is 'new y'

    if direction_str == "n":
        nx = x
        ny = y - 1
    elif direction_str == "ne":
        nx = x + 1
        ny = y if x % 2 == 0 else y - 1
    elif direction_str == "no":
        nx = x - 1
        ny = y if x % 2 == 0 else y - 1
    elif direction_str == "s":
        nx = x
        ny = y + 1
    elif direction_str == "se":
        nx = x + 1
        ny = y if x % 2 == 1 else y + 1
    elif direction_str == "so":
        nx = x - 1
        ny = y if x % 2 == 1 else y + 1
    else:
        print(f"Direction inconnue: {direction_str}")
        sys.exit(1)  # TODO: rly return 1 and not something else fot this one ?
        return [-1, -1]  # in case the sys.exit fails, this will trigger an error later

    return nx, ny


_is_valid_position = (
    lambda pos, width, height: 0 <= pos[0] < width and 0 <= pos[1] < height
)

_direction_str_from_int = lambda direction: _DIRECTION_CHARS[direction - 1]


if __name__ == "__main__":
    try:
        exit_code: int = main()
    except Exception as e:
        print(f"Validationde carte ratée. Erreur: {e}")
        traceback.print_exc()
        sys.exit(1)
    if type(exit_code) != int:
        print(
            f'Code de sortie de type invalide "{type(exit_code)}", avec comme valeur "{exit_code}"'
        )
        sys.exit(1)
    if exit_code != 0:
        print("carte invalide")
    sys.exit(exit_code)
