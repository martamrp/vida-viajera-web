$(document).ready(function () {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function () {
        localStorage.removeItem('userId');
    });

    $(window).on("beforeunload", function () {
        localStorage.removeItem('trip');
    });

    var tripToUpdate = localStorage['trip'];
    if (tripToUpdate === undefined) {
        window.location.href = "mostrar_datos.html";
    }
    else {
        var trip = JSON.parse(tripToUpdate);

        $.ajax({
            type: "GET",
            url: "http://localhost:8080/countries",
            contentType: "application/json",
            success: function (countries) {
                var originCountrySelect = document.getElementById("originCountry");
                var destinationCountrySelect = document.getElementById("destinationCountry");
                countries.forEach(country => {
                    originCountrySelect.options[originCountrySelect.options.length] = new Option(country.name, country.code);
                    destinationCountrySelect.options[destinationCountrySelect.options.length] = new Option(country.name, country.code);

                    if(country.code.toLowerCase() == trip.originCountry.toLowerCase()){
                        originCountrySelect.options[originCountrySelect.options.length-1].setAttribute('selected','selected');
                    }
                    if(country.code.toLowerCase() == trip.destinationCountry.toLowerCase()){
                        destinationCountrySelect.options[destinationCountrySelect.options.length-1].setAttribute('selected','selected');
                    }
                });
            },
            error: function () {
                alert('Ha ocurrido un error inesperado');
            }
        });

        $("#origin").val(trip.origin);
        $("#destination").val(trip.destination);
        $("#startDate").val(trip.startDate);
        $("#endDate").val(trip.endDate);
        $("input:radio[name='options'][value=" + trip.reasonId + "]").prop('checked', true);
        $("#price").val(trip.price);
    }

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
        originCountry: $('#originCountry').val(),
        destination: $('#destination').val(),
        destinationCountry: $('#destinationCountry').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        reasonId: $("input:radio[name='options']:checked").val(),
        price: $('#price').val()
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