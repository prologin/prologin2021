#!/bin/bash

# Starts the web server for the replay

rm -f replay/www/dump.json

if [ -n "$1" ]
then
    cp "$1" replay/www/dump.json
fi

python3 front_server.py replay
