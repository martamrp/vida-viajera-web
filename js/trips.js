$(document).ready(function() {
    var userId = localStorage['userId'];
    var username = localStorage['username'];
    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/countries",
        success: function(countryCodes) {
            var imgFlags = "";
            countryCodes.forEach(countryCode => {
                imgFlags += "<img src='./img/flags2/" + countryCode + ".svg' width='30px' title='" + countryCode + "' /> ";
            });
            $('#imgFlags').prepend(imgFlags);
        },
        error: function() {
            alert('Ha ocurrido un error inesperado');
        }
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/trips",
        success: function(trips) {
            var table = $('#tripsTable').DataTable({
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
                },
                "pageLength": 7,
                "lengthMenu": [7, 10, 25, 50],
                "data": trips,
                "columns": [
                    { "data": "origin" },
                    { "data": "destination" },
                    { "data": "startDate" },
                    { "data": "endDate" },
                    {
                        "data": null,
                        "render": function(trip) {
                            return getTotalDays(new Date(trip.startDate), new Date(trip.endDate));
                        }
                    },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function(trip) {
                            if (trip.reasonId == 1) {
                                return '<img src="./img/icons8-beach-100.png" width="32px" title="Ocio" />';
                            }
                            return '<img src="./img/icons8-briefcase-100.png" width="32px" title="Trabajo" />';
                        }
                    },
                    {
                        "data": null,
                        "render": function(trip) {
                            return trip.price + ' €';
                        }
                    },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function(data, type, full) {
                            return '<input type="image" width="24px" id="update" src="./img/icons8-edit-64.png" alt="Submit Form" title="Editar" />' +
                                '<input type="image" width="24px" id="delete" src="./img/icons8-delete-bin-64.png" alt="Submit Form" title="Eliminar" />';
                        }
                    }
                ]
            });

            var startDateColumn = table.column(2).data();
            var endDateColumn = table.column(3).data();

            var totalDays = 0;
            for (var i = 0; i < startDateColumn.length; i++) {
                totalDays += getTotalDays(new Date(startDateColumn[i]), new Date(endDateColumn[i]));
            }

            $('#totalDays').text(username + ", en total y hasta la fecha has viajado " + totalDays + " días.");

            $('#tripsTable').on('click', '#update', function() {
                var trip = table.row($(this).parents('tr')).data();
                localStorage['trip'] = JSON.stringify(trip);
                window.location.href = "actualizar_viaje.html";
            });

            $('#tripsTable').on('click', '#delete', function() {
                var question = confirm("¿Estás seguro que deseas eliminar este viaje?");
                if (question == true) {
                    var trip = table.row($(this).parents('tr')).data();

                    $.ajax({
                        type: "DELETE",
                        url: Server + "/trips/" + trip.id,
                        contentType: "application/json",
                        success: function(trip) {
                            // eliminar viaje
                            window.location.href = "mostrar_datos.html";
                            alert("El viaje ha sido eliminado");
                        },
                        error: function(xhr) {
                            if (xhr.status == 400 || xhr.status == 409) {
                                alert(xhr.responseText);
                            } else {
                                alert('Ha ocurrido un error inesperado');
                            }
                        }
                    });
                    return false;
                } else {
                    alert("El viaje no ha sido eliminado");
                }
            });
        },
        error: function() {
            alert('Ha ocurrido un error inesperado');
        }
    });
});

function getTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}