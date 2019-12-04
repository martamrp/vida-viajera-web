$(document).ready(function() {
    if (localStorage['userId'] === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
    })
});