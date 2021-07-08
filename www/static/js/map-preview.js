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

$(function() {
    let $preview = $('#map-preview'), $map_content = $('#map-contents');

    // TODO : Update
    let width = 400;

    $preview.hide();

    let scripts = [
        '/static/js/pixi.min.js',
        '/static/js/prologin.js',
        '/static/js/graphics.js',
        '/static/js/gamestate.js',
        '/static/js/viewer.js',
    ];

    // Link css
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/static/css/theme.css'));

    loadScripts(scripts, function() {
        start_preview($preview, $map_content, width);

        // reveal the UI
        $preview.fadeIn('fast');
    });
});
