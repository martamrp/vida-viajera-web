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
            $('#info3').text("Has hecho "+stats.leisureTrip+" viaje/s por ocio y "+stats.businessTrip+" viaje/s por trabajo.");
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});