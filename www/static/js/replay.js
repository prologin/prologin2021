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

    $replay.html(`
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
    </ul>

    <div id="canvas"></div>
    `);

    $replay.hide();

    let scripts = [
        'static/js/pixi.min.js',
        'static/js/prologin.js',
        'static/js/graphics.js',
        'static/js/gamestate.js',
        'static/js/replay_utils.js',
        'static/js/replay_viewer.js',
    ];

    loadScripts(scripts, function() {
        start_replay($replay, $dump_content.text());

        // reveal the UI
        $replay.fadeIn('fast');
    });
});
