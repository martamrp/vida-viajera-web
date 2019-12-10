$(document).ready(function() {

    $("#loginForm").submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: Server + "/users/login",
            contentType: "application/json",
            data: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val()
            }),
            success: function(user) {
                // Guardar el id en la sesion
                localStorage['userId'] = user.id;
                localStorage['username'] = user.username;
                window.location.href = "trips.html";
            },
            error: function(xhr) {
                if (xhr.status == 400) {
                    swal("Contraseña incorrecta!", { icon: "error", })
                } else {
                    swal("Ha ocurrido un error inesperado!", { icon: "error", })
                }
            }
        });
        return false;
    });

});