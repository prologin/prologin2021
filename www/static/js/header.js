
let jqueryImport = document.createElement("script");
jqueryImport.src = ""

document.body.appendChild(jqueryImport);

let scriptsUrl = [
    '/static/js/jquery-3.6.0.min.js',
    '/static/js/pixi.min.js',
    '/static/js/prologin.js',
    '/static/js/graphics.js',
    '/static/js/gamestate.js',
    '/static/js/viewer.js',
];

for (let script in scriptsUrl)
{
    let jqueryImport = document.createElement("script");
    jqueryImport.src = script;
    document.body.appendChild(jqueryImport);
}

$(function() {
    $('[role=complementary] h1').text('').html('<object data="/static/img/logo_prologin_2021.png" style="width:100% !important; margin-top: 0.5em;" type="image/png" />');

    const p1 = $('<img src="/static/img/easter_1.apng" class="easter-egg" />'),
        p2 = $('<img src="/static/img/easter_2.apng" class="easter-egg" />');

    $('body').append(p1).append(p2);
    $('.easter-egg').on('click', function() {
        const p = $(this);
        if (p.hasClass('visible')) {
            p.removeClass('visible');
        } else {
            p.removeClass('peak').addClass('visible');
        }
    });

    [p1, p2].forEach(function (p) {
        if (Math.random() < .5) {
            p.css('left', 64 + Math.random() * (document.body.clientWidth - 128 - 64));
            setTimeout(function() {
                const p = Math.random() < .5 ? p1 : p2;
                p.addClass('peak');
            },
                1000 * (5 + Math.random() * 10));
        }
    });

});

