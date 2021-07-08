#!/usr/bin/env python3
import sys

_PANDA_CHARS = ['A', 'B', 'X', 'Y']
_BABY_PANDA_CHARS = ['C', 'Z']
_BRIDGE_SIGN_CHARS = ['+', '-']

def main():
	# read stdin
	map_str = sys.stdin.read()
	# check num lines
	num_lines = map_str.split('\n', 1).__len__()
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
	map_ = []
	buffer = ''
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
		code = _addtilebuffer(buffer, x, y, map_)
		if code == 1: return 1
		buffer = ''

		# next coords
		if (x := x + 1) == width:
			x = 0
			y += 1

	return _checkmap(map_)


def _addtilebuffer(buffer, x, y, map_):
	# basic length check
	if len(buffer) != 3:
		print('Invalid tile length:', buffer)
		return 1
	# water tile easy check
	if '_' in buffer and buffer != '___':
		print('Cannot have "_" in tile and it not being "___"')
		return 1

	# either panda/bridge, bridge or baby panda
	d = {'x': x, 'y': y}

	# panda/bridge
	if buffer[0] in _PANDA_CHARS:
		player = '1' if buffer[0] in _PANDA_CHARS[:2] else '2'
		# add panda
		d['player'] = player
		d['panda'] = buffer[0]
		# try and convert value & direction
		try:
			value = int(buffer[1])
			direction = int(buffer[2])
		except Exception as e:
			print('Failed to convert value or direction for tile "{}". Caused: {}'.format(buffer, e))
			return 1
		# check value & direction values
		if not 0 < value < 7:
			print('Invalid value (must be in [1-6]): {}'.format(value))
			return 1
		if not 0 < direction < 7:
			print('Invalid direction (must be in [1-6]): {}'.format(direction))
			return 1
		# add bridge
		d['bridge'] = {'value': value, 'direction': direction, 'sign': '?'}
		return 0

	# bridge
	if buffer[0] in _BRIDGE_SIGN_CHARS:
		sign = buffer[0]
		# try and convert value & direction
		try:
			value = int(buffer[1])
			direction = int(buffer[2])
		except Exception as e:
			print('Failed to convert value or direction for tile {}. Caused: {}'.format(buffer, e))
			return 1
		# check value & direction values
		if not 0 < value < 7:
			print('Invalid value (must be in [1-6]): {}'.format(value))
			return 1
		if not 0 < direction < 7:
			print('Invalid direction (must be in [1-6]): {}'.format(direction))
			return 1
		# add bridge
		d['bridge'] = {'value': value, 'direction': direction, 'sign': sign}
		return 0

	# baby
	if buffer[0] in _BABY_PANDA_CHARS:
		player = '1' if buffer[0] == _BABY_PANDA_CHARS[0] else '2'
		# try and convert baby panda id
		try: id_ = int(buffer[1:])
		except Exception as e:
			print('Failed to convert id "{}". Caused: {}'.format(buffer[1:], e))
			return 1
		# add baby panda
		d['player'] = player
		d['baby panda'] = buffer[0]
		d['id'] = id_
		return 0

	print('Unkown first char of tile "{}". Tile is "{}"'.format(buffer[0], buffer))
	return 1


def _checkmap(map_):
	pass



if __name__ == '__main__':
	exit_code = main()
	sys.exit(exit_code)

