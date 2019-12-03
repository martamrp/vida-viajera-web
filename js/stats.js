$(document).ready(function() {
    var userId = localStorage['userId'];

    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
    });

    $("#back").click(function() {
        window.location.href = "mostrar_datos.html";
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/stats",
        success: function(stats) {
            if (stats.cheapestTrip == undefined) {
                $('#noTrips').text('Todavía no has añadido ningún viaje. ¿Por qué no empiezas ahora?');
            } else {
                $('#statsList').append("<li>El viaje más económico ha sido a " + stats.cheapestTrip.destination + " y ha costado " + stats.cheapestTrip.price + " euros.</li>");
                $('#statsList').append("<li>El viaje más caro ha sido a " + stats.mostExpensiveTrip.destination + " y ha costado " + stats.mostExpensiveTrip.price + " euros.</li>");
                $('#statsList').append("<li>Has hecho " + stats.leisureTrips + " viaje/s por ocio y " + stats.businessTrips + " viaje/s por trabajo.</li>");
                $('#statsList').append("<li>Tu viaje más corto ha sido a " + stats.shortestTrip.destination + " y ha durado " + getTotalDays(new Date(stats.shortestTrip.startDate), new Date(stats.shortestTrip.endDate)) + " día/s.</li>");
                $('#statsList').append("<li>Tu viaje más largo ha sido a " + stats.longestTrip.destination + " y ha durado " + getTotalDays(new Date(stats.longestTrip.startDate), new Date(stats.longestTrip.endDate)) + " días.</li>");
                var cheapestTripPerDay = stats.cheapestTripPerDay.price / getTotalDays(new Date(stats.cheapestTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
                $('#statsList').append("<li>En proporción el viaje más barato que has hecho es " + stats.cheapestTripPerDay.destination +
                    " con un coste de " + cheapestTripPerDay.toFixed(2) + "€/día.</li>");
                var mostExpensiveTripPricePerDay = stats.mostExpensiveTripPerDay.price / getTotalDays(new Date(stats.mostExpensiveTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
                $('#statsList').append("<li>En proporción el viaje más caro que has hecho es " + stats.mostExpensiveTripPerDay.destination +
                    " con un coste de " + mostExpensiveTripPricePerDay.toFixed(2) + "€/día.</li>");

                $.ajax({
                    type: "GET",
                    url: Server + "/users/" + userId + "/countries",
                    success: function(countryCodes) {
                        $('#statsList').append("<li>Has estado en " + countryCodes.length + " países diferentes.</li>");

                        $.ajax({
                            type: "GET",
                            url: Server + "/users/" + userId + "/regions",
                            success: function(regions) {
                                var text = "Has estado en un total de " + regions.length + " continentes diferentes:";
                                regions.forEach(region => {
                                    text += " " + region.name;
                                });
                                $('#statsList').append("<li>" + text + ".</li>");
                                $('#statsList').append("<li>Y has recorrido el " + (countryCodes.length / 247 * 100).toFixed(2) + "% del mundo!</li>");
                            },
                            error: function() {
                                alert('Ha ocurrido un error inesperado');
                            }
                        });
                    },
                    error: function() {
                        alert('Ha ocurrido un error inesperado al obtener tus paises visitados');
                    }
                });
            }
        },
        error: function() {
            alert('Ha ocurrido un error inesperado al obtener tus estadísticas');
        }
    });
});

function getTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}