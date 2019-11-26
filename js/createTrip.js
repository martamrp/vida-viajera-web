$(document).ready(function () {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function () {
        localStorage.removeItem('userId');
    });

    // $("#back").click(function () {
    //     window.location.href = "mostrar_datos.html";
    // });

    $("#addTripForm").submit(function (event) {
        event.preventDefault();
        createTrip();
    });

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
            });
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});

function createTrip() {
    var json = JSON.stringify({
        userId: localStorage['userId'],
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
        type: "POST",
        url: "http://localhost:8080/trips",
        contentType: "application/json",
        data: json,
        success: function (trip) {
            // añadir viaje
            alert('El viaje se ha añadido correctamente.');
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
