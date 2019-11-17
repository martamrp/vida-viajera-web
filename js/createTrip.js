$(document).ready(function () {

    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }

    $("#back").click(function () {
        window.location.href = "mostrar_datos.html";
    });

    $("#addTripForm").submit(function (event) {
        event.preventDefault();
        createTrip();
    });

    $("#logout").click(function () {
        localStorage.removeItem('userId');
    });
});

function createTrip() {
    var json = JSON.stringify({
        userId: localStorage['userId'],
        origin: $('#origin').val(),
        destination: $('#destination').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        reasonId: $("input:radio[name='options']:checked").val()
    })
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/trips",
        contentType: "application/json",
        data: json,
        success: function (trip) {
            // añadir viaje
            alert('el id de viaje es: ' + trip.id + ', el id de usuario es: ' + trip.userId + ' el origen es:  ' + trip.origin + ' el destino es:' + trip.destination + ' la fecha inicio es ' + trip.startDate + ' la fecha fin es: ' + trip.endDate + ' y el motivo de viaje es: ' + trip.reasonId);
            //localStorage['userId']=user.id;
            window.location.href = "mostrar_datos.html";
        },
        error: function (xhr) {
            if (xhr.status == 400 || xhr.status == 409) {
                alert(xhr.responseText);
            }
            else {
                alert('Ha ocurrido un error inesperado');
            }
        }
    });
    return false;

}
