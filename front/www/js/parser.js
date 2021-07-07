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
	let width = obj['map']['size']['x'],
		height = obj['map']['size']['y'];
	gameState = new GameState(width, height);
	// every cell
	for (let cell of obj['map']['cells'])
	{
		let x = cell['position']['x'],
			y = cell['position']['y'];
		switch(cell['type'])
		{
			case 'LIBRE':
				continue;
			case 'BEBE':
				gameState.panda_map[y][x].baby_panda = new BabyPanda(
					(cell['player'] + 1).toString(),
					cell['id']
				);
				break;
			case 'PONT':
				if (cell['panda'])
					gameState.panda_map[y][x].panda = new Panda(
						(cell['player'] + 1).toString(),
						cell['id']
					);
				gameState.map[y][x].bridge = new BridgeTile(
					directionIntFromFullStr(cell['direction']),
					cell['value'],
					cell['is_start'] ? '+' : '-',
					[x, y]
				)
				break;
			default:
				console.warn('Unknown cell type: ', cell['type']);
				break;
		}
	}
}

function directionIntFromFullStr(direction_str)
{
	switch(direction_str)
	{
		case 'NORD': return 1;
		case 'NORD_EST': return 2;
		case 'NORD_OUEST': return 3;
		case 'SUD': return 4;
		case 'SUD_EST': return 5;
		case 'SUD_OUEST': return 6;
		default:
			console.warn('Unknown direction str: ', direction_str);
			return -1;
	}
}

/*
fetch("/example-dump.json").then(res => {
    if (res.status === 200)
        res.text().then(parseJSON);
});
*/
