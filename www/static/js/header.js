
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
    $('h1').text('').html('<object data="/static/img/logo_prologin_2021.png" style="width:100%; margin-top: 0.5em;" type="image/png" />');
});

