$(document).ready(function () {

    var userId = localStorage['userId'];
    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function () {
        localStorage.removeItem('userId');
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + userId + "/trips",
        success: function (trips) {
            var table = $('#tripsTable').DataTable({
                "data": trips,
                "columns": [
                    { "data": "origin" },
                    { "data": "destination" },
                    { "data": "startDate" },
                    { "data": "endDate" },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function (data, type, full) {
                            const startDate = new Date(data.startDate);
                            const endDate = new Date(data.endDate);
                            const diffTime = Math.abs(endDate - startDate);
                            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        }
                    },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function (data, type, full) {
                            if (data.reasonId == 1){
                                return '<img src="./img/icons8-beach-100.png" width="32px" title="Ocio" />';
                            }
                            return '<img src="./img/icons8-briefcase-100.png" width="32px" title="Trabajo" />';
                        }
                    },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function (data, type, full) {
                            return '<input type="image" width="24px" id="saveform" src="./img/icons8-edit-64.png" alt="Submit Form" />'
                                +  '<input type="image" width="24px" id="saveform" src="./img/icons8-delete-bin-64.png" alt="Submit Form" />';
                        }
                    }
                ]
            });
            $('#tripsTable tbody').on('click', 'input', function () {
                var trip = table.row($(this).parents('tr')).data();
                alert('Quiero borrar el id de viaje: ' + trip.id
                    + ' del usuario: ' + trip.userId + ' con origen: ' + trip.origin
                    + ' y con destino:' + trip.destination);
            });
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});
/*
function clickOnEditTrip() {
    var table = $('#tripsTable').DataTable();
    var trip = table.row($(this).parents('tr')).data();
    alert('Quiero borrar el id de viaje: ' + trip.id
        + ' del usuario: ' + trip.userId + ' con origen: ' + trip.origin
        + ' y con destino:' + trip.destination);
}*/