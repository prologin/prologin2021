// 'use strict'; // better not use strict mode for parsing

/**
 * Takes in a raw json string. Returns the corresponing GameState object
 * @param	{String}	raw		Raw json string
 */
function parseJSON(raw)
{
	// Parse the Json data
	let obj = JSON.parse(raw);
	// create new GameState
	let width = obj['map']['size']['width'],
		height = obj['map']['size']['height'];
	gameState = new GameState(width, height);
	// every cell
	for (let cell of obj['map']['cells'])
	{
		switch(cell['type'])
		{
			case 'LIBRE':
				continue;
			case 'BEBE':
				gameState.panda_map[y][x].baby_panda = new BabyPanda(cell['player'].toString(), cell['id']);
				break;
			case 'PONT':
				if (cell['panda'])
					gameState.panda_map[y][x].panda = new Panda(cell['player'], cell['id']);
				let x = cell['position']['x'],
					y = cell['position']['y'];
				gameState.map[y][x].bridge = new BridgeTile(
					cell['direction'],
					cell['value'],
					cell['is_start'] ? '-' : '+',
					[x, y]
				)
				break;
			default:
				console.warn('Unknown cell type: ', cell['type']);
				break;
		}
	}
}
