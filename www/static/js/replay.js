$(function () {
    let $replay = $('#replay'),
        $dump_content = $('#dump');

    $replay.hide();

    $.getScript('/static/js/pixi.min.js')
    .done(function() {
        $.getScript('/static/js/replay_viewer.js')
        .done(function() {
            $.getScript('/static/js/replay_utils.js')
            .done(function() {
                start_replay($replay, $dump_content.text());
                // reveal the UI
                $replay.fadeIn('fast');
            });
        });
    });

});
