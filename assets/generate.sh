#!/bin/bash

set -e

rm -rf images
mkdir images
python3 generate.py
