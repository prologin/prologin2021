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
