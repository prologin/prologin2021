// 'use strict'; // better not use strict mode for parsing

/**
 * Takes in a raw json string. Returns the corresponing GameState object
 * @param    {String}    raw        Raw json string
 */
function parseJSON(raw)
{
    // Parse the Json data
    try {
        var obj = JSON.parse(raw);
    } catch {
        return null;
    }
    // create new GameState
    let width = obj['map']['size']['x'],
        height = obj['map']['size']['y'];
    let gameState = new GameState(width, height);
    gameState.round = obj['round']['round_id'];
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
                    cell['value'],
                    directionIntFromFullStr(cell['direction']),
                    cell['is_start'] ? '+' : '-',
                    [x, y]
                )
                break;
            default:
                console.warn('Unknown cell type: ', cell['type']);
                break;
        }
    }

    gameState.players['1'].points = obj.players[0].score;
    gameState.players['2'].points = obj.players[1].score;
    gameState.players['1'].babies_on_back_1 = obj.players[0].pandas[0].saved_babies;
    gameState.players['1'].babies_on_back_2 = obj.players[0].pandas[1].saved_babies;
    gameState.players['2'].babies_on_back_1 = obj.players[1].pandas[0].saved_babies;
    gameState.players['2'].babies_on_back_2 = obj.players[1].pandas[1].saved_babies;

    return gameState;
}

function directionIntFromFullStr(direction_str)
{
    switch(direction_str)
    {
        case 'NORD_EST': return 1;
        case 'SUD_EST': return 2;
        case 'SUD': return 3;
        case 'SUD_OUEST': return 4;
        case 'NORD_OUEST': return 5;
        case 'NORD': return 6;
        default:
            console.warn('Unknown direction str: ', direction_str);
            return -1;
    }
}

