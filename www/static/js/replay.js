function loadScripts(scripts, onLoaded) {
    let scriptsLoaded = 0;

    for (let script of scripts) {
        $.getScript(script).done(function() {
            ++scriptsLoaded;

            if (scriptsLoaded === scripts.length) {
                onLoaded();
            }
        })
    }
}

$(function () {
    let $replay = $('#replay'),
        $dump_content = $('#dump');

    let width = 1920;

    $replay.html(`
    <link rel="stylesheet" href="static/css/theme.css">

    <input type="button" value="AVANT" id="prev" onclick="onPrevClick()"></input>
    <input type="button" value="APRES" id="next" onclick="onNextClick()"></input>
    <span>
        <p style="display: inline;">Replay automatique :</p>
        <input type="checkbox" value="Replay automatique" id="autoreplay"
            onchange="onAutoReplayChange()" checked="true"></input>
    </span>

    <ul>
        <li id="state-indicator"></li>
        <li id="p1-points"></li>
        <li id="p2-points"></li>
        <li id="p1-babies"></li>
        <li id="p2-babies"></li>
    </ul>

    <div id="winner">
        <p id="winner-title">Joueur 1</p>
        <img id="winner-img" />
    </div>

    <br />
    <div id="canvas"></div>
    <br />

    <h3>Raccourcis :</h3>
    <ul>
        <li>B : Avant</li>
        <li>N : Après</li>
        <li>Espace : Replay automatique</li>
    </ul>
    `);

    $replay.hide();

    let scripts = [
        'static/js/pixi.min.js',
        'static/js/replay-one-file.js'
        /*'static/js/prologin.js',
        'static/js/graphics.js',
        'static/js/gamestate.js',
        'static/js/parser.js',
        'static/js/replay_viewer.js',
        'static/js/replay_utils.js',*/
    ];

    loadScripts(scripts, function() {
        let url = window.location.href;
        if (!url.endsWith('/')) url += '/';
        url += 'dump';
        /*fetch(url)
        .then(response => console.log(response))
        .then(data => [console.log(data), start_replay(data, width)]);*/

        // Load dump named dump.json if necessary
        fetch(url).then(res => {
            if (res.status === 200)
                res.text().then(data => start_replay(data, width));
            else
                console.error('No dump.json found. res:', res);
        });

        //start_replay($dump_content.text(), width);

        // reveal the UI
        $replay.fadeIn('fast');
    });
});
