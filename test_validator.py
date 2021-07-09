#!/usr/bin/env python
import unittest, os
import timeout_decorator
import subprocess

# globals
ROOT_DIR = os.getcwd()
CMD_FORMAT_STR = './www/validator.py < {}'
VERIFICATION_TIMEOUT_SEC = 1
fail_maps_paths = list()
current_map_path = ''
# lambdas
get_path = lambda path: os.path.join(ROOT_DIR, path)

@timeout_decorator.timeout(VERIFICATION_TIMEOUT_SEC)
def run_map_validator(map_path):
	exit_code = os.system(CMD_FORMAT_STR.format(map_path))
	return exit_code

@validate_map_decorator
def validate_map(map_path):
	global current_map_path
	current_map_path = map_path
	return run_map_validator(map_path) == 0

def validate_map_decorator(func):
	global fail_maps_paths, current_map_path
	def wrapper(*args, **kwargs):
		try:
			value = func(*args, **kwargs)
		except Exception as e:
			fail_maps_paths.append({'path': current_map_path, 'error': e})
		return value
	return wrapper

class UnittestSanityCheck(unittest.TestCase):
	''' The UnittestSanityCheck class's only purpose is to check the unittest module sanity
	'''

	def test_equals(self):
		self.assertEquals(1, 2)

	def test_true(self):
		self.assertTrue(0 == 0, True)

	def test_false(self):
		self.assertFalse(0 == 1, False)

	def test_raises(self):
		with self.assertRaises(ValueError):
			int('a')

class TestBasicCases(unittest.TestCase):
	''' The TestBasicCases class tests game maps stored in maps/tests/
	'''

	def basic_map(self):
		pass

	def test_all_maps(self):
		# get abs paths to maps
		success_maps_dir_path = get_path('maps/tests/success')
		fail_maps_dir_path = get_path('maps/tests/fail')
		# path join lambda
		get_success_path = lambda path: os.path.join(ROOT_DIR, 'maps/tests/success', path)
		get_fail_path = lambda path: os.path.join(ROOT_DIR, 'maps/tests/fail', path)
		# list dirs with abs paths
		success_maps = map(get_success_path, os.listdir(success_maps_dir_path))
		fail_maps = map(get_fail_path, os.listdir(fail_maps_dir_path))
		# test
		for success_map in success_maps:
			self.assertTrue(validate_map(success_map))
		for fail_map in fail_maps:
			self.assertFalse(validate_map(fail_maps))


if __name__ == '__main__':
	# test
	unittest.main()
