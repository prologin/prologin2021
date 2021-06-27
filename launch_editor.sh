#!/bin/bash

# Starts the web server for the map editor

rm editor/www/open.map

if [ -n "$1" ]
then
    cp "$1" editor/www/open.map
fi

python3 front_server.py editor
