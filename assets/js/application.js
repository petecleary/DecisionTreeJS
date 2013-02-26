$(document).ready(function () {
    var root = (location.href.toLowerCase().indexOf("localhost") !== -1 && document.location.origin !== undefined) ? document.location.origin + '/' : 'http://petecleary.github.com/DecisionTreeJS/';
    //build top nav
    for (var x = 0; x < navigation.top.length; x++) {
        var c = (location.href.toLowerCase().indexOf((root + navigation.top[x].href).toLowerCase()) !== -1) ? "active" : "";
        if (c === "" && location.href.toLowerCase().indexOf("examples") !== -1 && navigation.top[x].href.toLowerCase().indexOf("examples") !== -1) c = "active";
        $('#topNav').append('<li class="' + c + '"><a href="' + root + navigation.top[x].href + '">' + navigation.top[x].text + '</a> </li>');
    }
    //build examples nav
    var exampleNavBrowser = $('#exampleNavBrowser');
    if (exampleNavBrowser != undefined) {
        for (var x = 0; x < navigation.examplesBrowser.length; x++) {
            var c = (location.href.toLowerCase().indexOf((root + navigation.examplesBrowser[x].href).toLowerCase()) !== -1) ? "active" : "";
            exampleNavBrowser.append('<li class="' + c + '"><a href="' + root + navigation.examplesBrowser[x].href + '"><i class="icon-chevron-right"></i>' + navigation.examplesBrowser[x].text + '</a> </li>');
        }
    }
    var exampleNavNode = $('#exampleNavNode');
    if (exampleNavNode != undefined) {
        for (var x = 0; x < navigation.examplesNode.length; x++) {
            var c = (location.href.toLowerCase().indexOf((root + navigation.examplesNode[x].href).toLowerCase()) !== -1) ? "active" : "";
            exampleNavNode.append('<li class="' + c + '"><a href="' + root + navigation.examplesNode[x].href + '"><i class="icon-chevron-right"></i>' + navigation.examplesNode[x].text + '</a> </li>');
        }
    }
});
