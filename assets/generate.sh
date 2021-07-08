#!/bin/bash

set -e

rm -rf images
mkdir images

cp background.svg images
python3 generate.py
