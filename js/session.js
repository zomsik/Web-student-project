/*jshint esversion: 6 */
$(document).ready(function() {

    if (sessionStorage.length == 0) {
        window.location.href = "index.html";
    }

    $('a[href = "index.html"]').click(function() {
        sessionStorage.clear();
    });
});