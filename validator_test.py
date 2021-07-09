#!/usr/bin/env python
import unittest, os

class UnittestSanityCheck(unittest.TestCase):

	def test_simple(self):
		self.assertEquals('foo'.upper(), 'FOO')

	def test_isupper(self):
		self.assertTrue('FOO'.isupper())
		self.assertFalse('Foo'.isupper())

	def test_split(self):
		s = 'hello world'
		self.assertEquals(s.split(), ['hello', 'world'])
		with self.assertRaises(TypeError):
			s.split(2)

class TestBasicCases(unittest.TestCase):

	def test_all_maps(self):
		# get abs paths to maps
		success_maps_dir_path = get_path('maps/tests/success')
		fail_maps_dir_path = get_path('maps/tests/fail')
		success_maps = os.listdir(success_maps_dir_path)
		fail_maps = os.listdir(fail_maps_dir_path)
		# test
		for success_map in success_maps:
			self.assertEquals


if __name__ == '__main__':
	ROOT_DIR = os.getcwd()
	CMD_FORMAT_STR = './www/validator.py < {}'
	get_path = lambda path: os.path.join(ROOT_DIR, path)
	validate_map = lambda path: 
	unittest.main()
