$(document).ready(function () {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }
    $("#back").click(function () {
        window.location.href = "mostrar_datos.html";
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/trips",
        success: function (trips) {
       

            $('#info1').text("El viaje más económico ha sido a ");


        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});