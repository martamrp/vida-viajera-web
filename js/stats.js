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

            $('#info1').text("El viaje más económico ha sido a " + stats.cheaperTrip.destination + " y ha costado " + stats.cheaperTrip.price + " euros.");
            $('#info2').text("El viaje más caro ha sido a " + stats.moreExpensiveTrip.destination + " y ha costado " + stats.moreExpensiveTrip.price + " euros.");
            $('#info3').text("Has hecho " + stats.leisureTrip + " viaje/s por ocio y " + stats.businessTrip + " viaje/s por trabajo.");
            $('#info4').text("Tu viaje más corto ha sido a " + stats.shortestTrip.destination + " y a durado " + getTotalDays(new Date(stats.shortestTrip.startDate), new Date(stats.shortestTrip.endDate)) + " días.");
            $('#info5').text("Tu viaje más largo ha sido a " + stats.longestTrip.destination + " y a durado " + getTotalDays(new Date(stats.longestTrip.startDate), new Date(stats.longestTrip.endDate)) + " días.");
            var cheapestTripPerDay = stats.cheapestTripPerDay.price / getTotalDays(new Date(stats.cheapestTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
            $('#info6').text("En proporción el viaje más barato que has hecho es " + stats.cheapestTripPerDay.destination +
                " con un coste de " + cheapestTripPerDay.toFixed(2) + "€/día.");
            var mostExpensiveTripPricePerDay = stats.mostExpensiveTripPerDay.price / getTotalDays(new Date(stats.mostExpensiveTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
            $('#info7').text("En proporción el viaje más caro que has hecho es " + stats.mostExpensiveTripPerDay.destination +
                " con un coste de " + mostExpensiveTripPricePerDay.toFixed(2) + "€/día.");
        },
        error: function() {
            alert('Ha ocurrido un error inesperado al obtener tus estadísticas');
        }
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/countries",
        success: function(countryCodes) {
            $('#info8').text("Has estado en " + countryCodes.length + " países diferentes.");
            $('#info10').text("Y has recorrido el " + (countryCodes.length / 247 * 100).toFixed(2) + "% del mundo!");

            $.ajax({
                type: "GET",
                url: Server + "/countries/",
                success: function(countries) {
                    var flags = "";
                    countries.forEach(country => {
                        if (countryCodes.includes(country.code)) {
                            flags += "<img src='./img/flags2/" + country.code + ".svg' width='30px' title='" + country.name + "' /> ";
                        } else {
                            flags += "<img style='-webkit-filter: grayscale(100%); filter: grayscale(100%);' src='./img/flags2/" + country.code + ".svg' width='30px' title='" + country.name + "' /> ";
                        }
                    });
                    $('#flags').prepend(flags);
                },
                error: function() {
                    alert('Ha ocurrido un error inesperado al obtener la lista de paises');
                }
            });
        },
        error: function() {
            alert('Ha ocurrido un error inesperado al obtener tus paises visitados');
        }
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/regions",
        success: function(regions) {
            var text = "Has estado en un total de " + regions.length + " continentes diferentes: ";
            regions.forEach(region => {
                text += region.name + " ";
            });
            $('#info9').text(text + ".");
        },
        error: function() {
            alert('Ha ocurrido un error inesperado');
        }
    });
});

function getTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}