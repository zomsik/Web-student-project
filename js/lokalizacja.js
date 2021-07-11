/*jshint esversion: 6 */
var markers = [];
var Coords = {
    lat: 51.248,
    lng: 22.566
};
var mapOptions = {
    zoom: 14,
    center: Coords
};

var map = new google.maps.Map($("#map-canvas")[0], mapOptions);
var infoWindow = new google.maps.InfoWindow();


$(function() {
    $(window).resize(function() {
        google.maps.event.trigger(map, "resize");
    });

    drawMarkers();

});

google.maps.event.addListener(map, 'click', function(event) {
    $('#InputLatitude').val(event.latLng.toJSON().lat);
    $('#InputLongitude').val(event.latLng.toJSON().lng);
});


function deleteMarker(TitleToDelete) {

    let key = sessionStorage.key(0) + "_lokalizacje";
    var retrieveItem = JSON.parse(localStorage.getItem(key));

    for (let i = 0; i < retrieveItem.length; i++) {
        if (retrieveItem[i].Tytul == TitleToDelete) {
            retrieveItem.splice(i, 1);
            localStorage.setItem(key, JSON.stringify(retrieveItem));
            if (retrieveItem.length == 0) localStorage.removeItem(key);
            reloadMarkers();
            return;
        }
    }

}

function deleteAll() {
    let key = sessionStorage.key(0) + "_lokalizacje";
    localStorage.removeItem(key);
    reloadMarkers();

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Usunięto wszystkie punkty!'
    });
}

function reloadMarkers() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    drawMarkers();
}

function drawMarkers() {
    let key = sessionStorage.key(0) + "_lokalizacje";
    if (localStorage.hasOwnProperty(key)) {
        var retrieveItem = JSON.parse(localStorage.getItem(key));


        for (let i = 0; i < retrieveItem.length; i++) {
            var Point = {
                lat: parseFloat(retrieveItem[i].Lat),
                lng: parseFloat(retrieveItem[i].Long)
            };
            var Title = retrieveItem[i].Tytul;

            var marker = new google.maps.Marker({
                position: Point,
                map: map,
                title: Title,
                label: {
                    text: Title,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px"
                }
            });

            markers.push(marker);

            google.maps.event.addListener(markers[i], "click", function(e) {

                var okienko = `<p>Szerokość: ${markers[i].position.lat()}</p>
                            <p>Długość: ${markers[i].position.lng()}</p>
                            <button type="button" class="btn btn-secondary" onClick="deleteMarker('${markers[i].title}')" >Usuń punkt</button>
                            `;


                infoWindow.setContent(okienko);
                infoWindow.open(map, markers[i]);


            });


        }
    }
}

function isInfoWindowOpen(infoWindow) {
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}



function savePoint() {
    let key = sessionStorage.key(0) + "_lokalizacje";

    let Tytul = $('#InputTitle').val();
    let Lat = $('#InputLatitude').val();
    let Long = $('#InputLongitude').val();

    var obiekt;

    if (localStorage.hasOwnProperty(key)) {
        obiekt = JSON.parse(localStorage.getItem(key));
    } else {
        obiekt = [];
    }

    if (Tytul == "" || Lat == "" || Long == "") {
        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Uzupełnij wszystkie pola!'
        });
        return;
    }

    for (let i = 0; i < obiekt.length; i++) {
        if (obiekt[i].Tytul == Tytul) {

            window.createNotification({
                closeOnClick: true,
                displayCloseButton: true,
                positionClass: 'nfc-top-right',
                onclick: false,
                showDuration: 2000,
                theme: 'warning'
            })({
                title: 'Niepowodzenie',
                message: 'Istnieje już taki punkt!'
            });

            return;
        }
    }

    if (isNaN(Lat) || isNaN(Long)) {
        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Współrzędne muszą być liczbami!'
        });
        return;
    }

    var punkt = {};
    punkt.Tytul = Tytul;
    punkt.Lat = Lat;
    punkt.Long = Long;

    obiekt.push(punkt);
    localStorage.setItem(key, JSON.stringify(obiekt));

    reloadMarkers();

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Pomyślnie dodano punkt!'
    });

}

(function($) {

    var parentOffset,
        item,
        overRight = false,
        newWidth,
        dragged = false;

    $.fn.dlResizeable = function(options) {

        item = this;

        $(document).mousedown(function(e) {
            newWidth = parentOffset.relX - item.outerWidth();
            if (overRight) {
                dragged = true;
            }
        });

        $(document).mouseup(function(e) {
            dragged = false;
        });

        $(document).mousemove(function(e) {
            parentOffset = item.offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            var widthToAdd = 0;

            /* check if mouse is above right border */
            if (relX >= item.outerWidth() - 4 && relX <= $("#item").outerWidth()) {
                item.css("cursor", "col-resize");
                overRight = true;
            } else {
                item.css("cursor", "default");
                overRight = false;
            }
            if (dragged) {
                newWidth = relX - item.outerWidth();
                item.width(item.outerWidth() + newWidth);
            }
        });

        return this;
    };

}(jQuery));

$(document).ready(function(e) {

    $("#item").dlResizeable();

});