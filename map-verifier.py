#!/usr/bin/env python3
import sys

_PANDA_CHARS = ['A', 'B', 'X', 'Y']
_BABY_PANDA_CHARS = ['C', 'Z']
_BRIDGE_SIGN_CHARS = ['+', '-']

def main() -> int:
	# read stdin
	map_str : str = sys.stdin.read()
	# check num lines
	num_lines : int = map_str.split('\n', 1).__len__()
	if num_lines < 2:
		print('Invalid line number:', num_lines)
		return 1
	# extract width & height
	splitted_map = map_str.split('\n', 1)
	first_line = splitted_map[0].split(' ')
	first_line = filter(None, first_line)
	if len(first_line) < 2:
		print('Invalid width height format')
		return 1
	width, height = int(first_line[0]), int(first_line[1])
	# fill map
	raw_map_str = splitted_map[1]
	num_chars = len(raw_map_str)
	if num_chars < 4 * width * height - 1:
		print('Not enough chars in the map string to form a map with width {} and height {}. {} < {}'.format(
			width, height, num_chars, 4 * width * height - 1))
		return 1
	# check presence of basics
	for panda_char in _PANDA_CHARS:
		panda_char_count = raw_map_str.count(panda_char)
		if panda_char_count != 1:
			if panda_char_count == 0:
				print('Missing panda:', panda_char)
				return 1
			else:
				print('Too much pandas of kind:', panda_char)
				return 1
	# init vars
	map_ : list[list[dict]] = []
	buffer : str = ''
	x, y = 0, 0
	# get all tiles
	for c in raw_map_str:
		# buffer finished ?
		if c != ' ' and c != '\n':
			buffer += c
			if len(buffer) != 3 or i != num_chars - 1:
				continue

		# trailing whitespace after map is finished ?

		# add tile buffer to map
		success, tile_dict = _addtilebuffer(buffer, x, y)
		if not success:
			print('Unsuccessful tile: {} at {}|{}'.format(buffer, x, y))
			return 1
		map_[y][x] : dict = tile_dict
		buffer = ''

		# next coords
		if (x := x + 1) == width:
			x = 0
			y += 1

	return _checkmap(map_)


def _addtilebuffer(buffer : str, x : int, y : int) -> tuple[bool, dict]:
	# basic length check
	if len(buffer) != 3:
		print('Invalid tile length:', buffer)
		return False, None

	# either panda/bridge, bridge or baby panda
	tile_dict = {
		'x': x, 'y': y,
		'water': False,
		'player': None,
		'panda': None,
		'baby panda': None,
		'bridge': None,
		'id': None
	}

	# water tile easy check
	if '_' in buffer:
		if buffer != '___':
			print('Cannot have "_" in tile and it not being "___"')
			return False, None
		else:
			tile_dict['water'] = True
			return True, tile_dict

	# panda/bridge
	if buffer[0] in _PANDA_CHARS:
		player = '1' if buffer[0] in _PANDA_CHARS[:2] else '2'
		# add panda
		tile_dict['player'] = player
		tile_dict['panda'] = buffer[0]
		# try and convert value & direction
		try:
			value = int(buffer[1])
			direction = int(buffer[2])
		except Exception as e:
			print('Failed to convert value or direction for tile "{}". Caused: {}'.format(buffer, e))
			return False, None
		# check value & direction values
		if not 0 < value < 7:
			print('Invalid value (must be in [1-6]): {}'.format(value))
			return False, None
		if not 0 < direction < 7:
			print('Invalid direction (must be in [1-6]): {}'.format(direction))
			return False, None
		# add bridge
		tile_dict['bridge'] = {'value': value, 'direction': direction, 'sign': '?'}
		return True, tile_dict

	# bridge
	if buffer[0] in _BRIDGE_SIGN_CHARS:
		sign = buffer[0]
		# try and convert value & direction
		try:
			value = int(buffer[1])
			direction = int(buffer[2])
		except Exception as e:
			print('Failed to convert value or direction for tile {}. Caused: {}'.format(buffer, e))
			return False, None
		# check value & direction values
		if not 0 < value < 7:
			print('Invalid value (must be in [1-6]): {}'.format(value))
			return False, None
		if not 0 < direction < 7:
			print('Invalid direction (must be in [1-6]): {}'.format(direction))
			return False, None
		# add bridge
		tile_dict['bridge'] = {'value': value, 'direction': direction, 'sign': sign}
		return True, tile_dict

	# baby
	if buffer[0] in _BABY_PANDA_CHARS:
		player = '1' if buffer[0] == _BABY_PANDA_CHARS[0] else '2'
		# try and convert baby panda id
		try: id_ = int(buffer[1:])
		except Exception as e:
			print('Failed to convert id "{}". Caused: {}'.format(buffer[1:], e))
			return False, None
		# add baby panda
		tile_dict['player'] = player
		tile_dict['baby panda'] = buffer[0]
		tile_dict['id'] = id_
		return True, tile_dict

	print('Unkown first char of tile "{}". Tile is "{}"'.format(buffer[0], buffer))
	return False, None


def _checkmap(map_ : list[list[dict]]) -> int:
	# check that all the tiles are dicts
	if not all([type(d) == dict for line in map_ for d in line]):
		print('Some elements int the map are not dicts: {}'.format(map_))
		return 1
	# check all tiles individually
	print(map_)
	return 0


def _partner_bridge_position_by_direction(pos : tuple[int, int], direction_str : str) -> tuple[int, int]:
	x, y = pos
	nx, ny = -1, -1 # 'nx' is 'new x' & 'ny' is 'new y'

	if direction_str == 'n':
		nx = x
		ny = y - 1
	elif direction_str == 'ne':
		nx = x + 1
		ny = y if x % 2 == 0 else y - 1
	elif direction_str == 'no':
		nx = x - 1
		ny = y if x % 2 == 0 else y - 1
	elif direction_str == 's':
		nx = x
		ny = y + 1
	elif direction_str == 'se':
		nx = x + 1
		ny = y if x % 2 == 1 else y + 1
	elif direction_str == 'so':
		nx = x - 1
		ny = y if x % 2 == 1 else y + 1
	else:
		print('Unrecognized direction str: {}'.format(direction_str))
		sys.exit(1) # TODO: rly return 1 and not something else fot this one ?
		return [-1, -1] # in case the sys.exit fails, this will trigger an error later

	return nx, ny


if __name__ == '__main__':
	exit_code = main()
	sys.exit(exit_code)

