$(document).ready(function () {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }
    $(window).on("beforeunload", function () {
        localStorage.removeItem('trip');
    });

    var tripToUpdate = localStorage['trip'];
    if (tripToUpdate === undefined) {
        window.location.href = "mostrar_datos.html";
    }
    else {
        var trip = JSON.parse(tripToUpdate);
        $("#origin").val(trip.origin);
        $("#destination").val(trip.destination);
        $("#startDate").val(trip.startDate);
        $("#endDate").val(trip.endDate);
        $("input:radio[name='options'][value=" + trip.reasonId + "]").prop('checked', true);
    }

    $("#back").click(function () {
        window.location.href = "mostrar_datos.html";
    });

    $("#updateTripForm").submit(function (event) {
        event.preventDefault();
        updateTrip();
    });

});

function updateTrip() {
    var trip = JSON.parse(localStorage['trip']);
    var json = JSON.stringify({
        id: trip.id,
        userId: trip.userId,
        origin: $('#origin').val(),
        destination: $('#destination').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        reasonId: $("input:radio[name='options']:checked").val()
    })
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/trips/" + trip.id,
        contentType: "application/json",
        data: json,
        success: function (trip) {
            // actualizar viaje
            alert('Tu viaje ha sido actualizado');
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