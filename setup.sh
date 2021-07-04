#!/bin/bash

# Setups everything, execute it once when you clone the repo

set -e

# Assets
cd assets
./generate.sh
cd ..
echo '> Assets générés'

# Spectator
cd spectator/champion
make
cd ../..
echo '> Spectateur initialisé'

# Front end
cp -r assets/images front/www
echo '> Front end initialisé'

echo '> Prologin2021 fonctionnel'
