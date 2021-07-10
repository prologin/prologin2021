#!/bin/bash
PATH=/usr/bin
# check python version
py_version=$(python -c 'import sys; print(sys.version_info.major)')
if [ $py_version -ne 3 ]; then
	echo Wrong python version
	exit 1
fi
# Unittests
echo [!] Sanity Check
./test_validator.py UnittestSanityCheck
echo [!] Map Tests
./test_validator.py MapTests

