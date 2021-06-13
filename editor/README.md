# Map Editor
The map editor is made using Pixi JS

## Structure
- www : Web site interface files

## Setup
1. Assets have to be generated
1. ```sh
# From prologin2021/editor working directory
cp -r ../assets/images www/static
python -m http.server
# Open http://0.0.0.0:8000/ in your browser
```