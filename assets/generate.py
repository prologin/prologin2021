# Execute this script using generate.sh

from PIL import Image


path_tileset = 'prologin.png'
path_output = 'images'

verbose = True

# Tile size in pixel
tile_size = 128

directions = [
    's',
    'so',
    'no',
    'n',
    'ne',
    'se',
]

# Tuples (i, j, name)
# i and j are indices (image_i == tile_size * i)
tiles = []

# Environment
tiles += [
    (8, 0, 'eau1'),
    (8, 1, 'eau2'),
    (8, 2, 'eau3'),
    (8, 3, 'eau4'),
    (8, 4, 'obstacle'),
]

# Players
tiles += [
    (0, 2, 'panda1'),
    (0, 3, 'panda1_bebe'),
    (0, 4, 'panda2'),
    (0, 5, 'panda2_bebe'),
]

# Bridges
bridges_i = 2
bridges_j = 0
for val in range(6):
    for direction in range(len(directions)):
        name = f'pont_{val + 1}_{directions[direction]}'
        tiles.append((bridges_i + val, bridges_j + direction, name))

# Process image
img = Image.open(path_tileset)

# Generate images
for i, j, name in tiles:
    # Compute coordinates
    x = j * tile_size
    y = i * tile_size
    path = path_output + '/' + name + '.png'

    # Crop and save
    tile_img = img.crop((x, y, x + tile_size, y + tile_size))
    tile_img.save(path)

    # Debug
    if verbose:
        print('Written', path)
