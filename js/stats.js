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
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
    
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/countries",
        success: function (countries) {
            $('#info6').text("Has estado en " + countries.length + " países diferentes.");
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