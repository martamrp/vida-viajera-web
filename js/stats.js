$(document).ready(function () {
    var userId = localStorage['userId'];

    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function () {
        localStorage.removeItem('userId');
    });

    $("#back").click(function () {
        window.location.href = "mostrar_datos.html";
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/stats",
        success: function (stats) {

            $('#info1').text("El viaje más económico ha sido a " + stats.cheaperTrip.destination + " y ha costado " + stats.cheaperTrip.price + " euros.");
            $('#info2').text("El viaje más caro ha sido a " + stats.moreExpensiveTrip.destination + " y ha costado " + stats.moreExpensiveTrip.price + " euros.");
            $('#info3').text("Has hecho " + stats.leisureTrip + " viaje/s por ocio y " + stats.businessTrip + " viaje/s por trabajo.");
            $('#info4').text("Tu viaje más corto ha sido a " + stats.shortestTrip.destination + " y a durado " + getTotalDays(new Date(stats.shortestTrip.startDate), new Date(stats.shortestTrip.endDate)) + " días.");
            $('#info5').text("Tu viaje más largo ha sido a " + stats.longestTrip.destination + " y a durado " + getTotalDays(new Date(stats.longestTrip.startDate), new Date(stats.longestTrip.endDate)) + " días.");
            var cheapestTripPerDay = stats.cheapestTripPerDay.price/getTotalDays(new Date(stats.cheapestTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
            $('#info6').text("En proporción el viaje más barato que has hecho es " + stats.cheapestTripPerDay.destination +
                " con un coste de " + cheapestTripPerDay.toFixed(2) + "€/día.");
            var mostExpensiveTripPricePerDay = stats.mostExpensiveTripPerDay.price/getTotalDays(new Date(stats.mostExpensiveTripPerDay.startDate), new Date(stats.mostExpensiveTripPerDay.endDate));
            $('#info7').text("En proporción el viaje más caro que has hecho es " + stats.mostExpensiveTripPerDay.destination +
                " con un coste de " + mostExpensiveTripPricePerDay.toFixed(2) + "€/día.");
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
    
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/countries",
        success: function (countries) {
            $('#info8').text("Has estado en " + countries.length + " países diferentes.");
            $('#info10').text("Y has recorrido el " + (countries.length/247*100).toFixed(2) + "% del mundo!");
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
    
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/regions",
        success: function (regions) {
            var text = "Has estado en un total de " + regions.length + " continentes diferentes: ";
            regions.forEach(region => {
                text += region.name + " ";
            });
            $('#info9').text(text+".");
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});

function getTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}