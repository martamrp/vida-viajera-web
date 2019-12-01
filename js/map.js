$(document).ready(function() {
    var userId = localStorage['userId'];
    if (userId === undefined) {
        window.location.href = "login.html";
    }

    var mymap = L.map('mapid').setView([30, 0], 2);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 2,
        maxZoom: 15,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYXJvZHJpZ3Vlem4iLCJhIjoiY2pvdWl6eDcyMHI4aTNwczMyaGdqdm81YiJ9.OFbMqz1fqhvAnOKr4x4VqQ'
    }).addTo(mymap);

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/countries",
        contentType: "application/json",
        success: function(countries) {
            countries.forEach(countryCode => {
                addCountryToMap(mymap, countryCode);
            });
        },
        error: function() {
            alert('Ha ocurrido un error inesperado');
        }
    });
});

function addCountryToMap(mymap, countryCode) {
    $.ajax({
        type: "GET",
        url: Server + "/countries/" + countryCode,
        contentType: "application/json",
        success: function(country) {
            var myIcon = L.icon({
                iconUrl: './img/flags/' + country.code.toLowerCase() + '.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });
            L.marker([country.lat, country.lng], { title: country.name, icon: myIcon, autopan: true }).addTo(mymap);
        },
        error: function() {
            alert('Ha ocurrido un error inesperado');
        }
    });
}