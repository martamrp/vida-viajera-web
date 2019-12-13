$(document).ready(function() {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
    });

    $("#addTripForm").submit(function(event) {
        event.preventDefault();
        createTrip();
    });

    $.ajax({
        type: "GET",
        url: Server + "/countries",
        contentType: "application/json",
        success: function(countries) {
            var originCountrySelect = document.getElementById("originCountry");
            var destinationCountrySelect = document.getElementById("destinationCountry");
            countries.forEach(country => {
                originCountrySelect.options[originCountrySelect.options.length] = new Option(country.name, country.code);
                destinationCountrySelect.options[destinationCountrySelect.options.length] = new Option(country.name, country.code);
            });
        },
        error: function() {
            swal("Ha ocurrido un error inesperado!", { icon: "error", });
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
        url: Server + "/trips",
        contentType: "application/json",
        data: json,
        success: function(trip) {
            window.location.href = "trips.html";
        },
        error: function(xhr) {
            swal("Ha ocurrido un error inesperado!", { icon: "error", });
        }
    });
    return false;

}