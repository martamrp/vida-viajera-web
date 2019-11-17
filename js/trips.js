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
                            if (data.reasonId == 1) {
                                return '<img src="./img/icons8-beach-100.png" width="32px" title="Ocio" />';
                            }
                            return '<img src="./img/icons8-briefcase-100.png" width="32px" title="Trabajo" />';
                        }
                    },
                    {
                        "data": null,
                        "sortable": false,
                        "render": function (data, type, full) {
                            return '<input type="image" width="24px" id="update" src="./img/icons8-edit-64.png" alt="Submit Form" title="Editar" />'
                                + '<input type="image" width="24px" id="delete" src="./img/icons8-delete-bin-64.png" alt="Submit Form" title="Eliminar" />';
                        }
                    }
                ]
            });

            $('#tripsTable').on('click', '#update', function () {
                var trip = table.row($(this).parents('tr')).data();
                localStorage['trip'] = JSON.stringify(trip);
                window.location.href = "actualizar_viaje.html";
            });

            $('#tripsTable').on('click', '#delete', function () {
                var question = confirm("¿Estás seguro que deseas eliminar este viaje?");
                if (question == true) {
                    var trip = table.row($(this).parents('tr')).data();

                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/trips/" + trip.id,
                        contentType: "application/json",
                        success: function (trip) {
                            // eliminar viaje
                            window.location.href = "mostrar_datos.html";
                            alert("El viaje ha sido eliminado");
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
                } else {
                    alert("El viaje no ha sido eliminado");
                }
            });
        },
        error: function () {
            alert('Ha ocurrido un error inesperado');
        }
    });
});
