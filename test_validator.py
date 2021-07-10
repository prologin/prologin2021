#!/usr/bin/env python
import unittest, os, sys
import timeout_decorator
from functools import wraps

# globals
ROOT_DIR = os.getcwd()
CMD_FORMAT_STR = './www/validator.py < "{}" > /dev/null 2>&1'
VERIFICATION_TIMEOUT_SEC = 1
# lambdas
get_path = lambda path: os.path.join(ROOT_DIR, path)

# Functions
@timeout_decorator.timeout(VERIFICATION_TIMEOUT_SEC)
def run_map_validator(map_path):
	exit_code = os.system(CMD_FORMAT_STR.format(map_path))
	return exit_code

def validate_map(map_path, success):
	current_map_path = map_path
	value = run_map_validator(map_path) == 0
	return value if success else not value


# Decorator
def validate_map_decorator(part_map_path):
	def validate_map_decorator_factory(func):
		success = part_map_path.startswith('success')
		map_path = os.path.join(ROOT_DIR, 'maps/tests/', part_map_path)
		def wrapper(*args, **kwargs):
			try:
				value = func(*args, map_path, success, **kwargs)
				args[0].assertTrue(value)
			except AssertionError as assert_error:
				args[0].fail(f'Failed test for {part_map_path} and success: {success}')
			except TimeoutError as timeout_error:
				args[0].fail(f'Test {part_map_path} timed out. Success: {success}')
			return value
		return wrapper
	return validate_map_decorator_factory


# Sanity Checks
class UnittestSanityCheck(unittest.TestCase):
	''' The UnittestSanityCheck class's only purpose is to check the unittest module sanity
	'''

	def test_equals(self):
		self.assertEqual(1, 1)

	def test_true(self):
		self.assertTrue(0 == 0, True)

	def test_false(self):
		self.assertFalse(0 == 1, False)

	def test_raises(self):
		with self.assertRaises(ValueError):
			int('a')

# Map Tests
class MapTests(unittest.TestCase):
	''' The MapTests class tests game maps stored in maps/tests/
	'''

	@validate_map_decorator('success/simple.map')
	def test_success_simple(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('success/20x20_tournoi.map')
	def test_success_20x20_tournoi(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('success/simple_with_wall.map')
	def test_success_simple_with_walls(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('success/simple.map')
	def test_fail_test(self, map_path, success):
		return validate_map(map_path, success)


	@validate_map_decorator('fail/empty_map.map')
	def test_fail_empty(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('fail/case_4_.map')
	def test_fail_case_4_(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('fail/invalid_dimensions.map')
	def test_fail_invalid_dimensions(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('fail/dim_and_map_not_matching.map')
	def test_fail_dim_and_map_not_matching(self, map_path, success):
		return validate_map(map_path, success)

	@validate_map_decorator('fail/dims_are_literals.map')
	def test_fail_dims_are_literals(self, map_path, success):
		return validate_map(map_path, success)


#

if __name__ == '__main__':
	# test
	unittest.main()
