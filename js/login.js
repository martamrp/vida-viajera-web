$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/users/login",
      contentType: "application/json",
      data: JSON.stringify({
        username: $('#username').val(),
        password: $('#password').val()
      }),
      success: function (user) {
        // Guardar el id en la sesion
        alert('Bienvenida '+user.username + '. Tu id es '+user.id);
        localStorage['userId']=user.id;
        window.location.href = "mostrar_datos.html";
      },
      error: function(/*xhr, textStatus, errorThrown*/){
        alert('Ha ocurrido un error inesperado');
      }
    });
    return false;
  });

});
