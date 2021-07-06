$(function () {
    let $preview = $('#map-preview'),
        $map_content = $('#map-contents');

    $preview.hide();

    $.getScript('/static/js/pixi.min.js')
    .done(function() {
        $.getScript('/static/js/viewer.js')
        .done(function() {
            start_preview($preview, $map_content);
            // reveal the UI
            $preview.fadeIn('fast');
        });
    });

});
