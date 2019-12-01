$(document).ready(function() {
    var userId = localStorage['userId'];

    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
    });

    $("#back").click(function() {
        window.location.href = "mostrar_datos.html";
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/countries",
        success: function(countryCodes) {

            $.ajax({
                type: "GET",
                url: Server + "/countries/",
                success: function(countries) {

                    var ctx = $('#myChart');
                    var myPieChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: [countryCodes.length, countries.length - countryCodes.length],
                                backgroundColor: ['rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)']
                            }],
                            labels: [
                                'Visitados',
                                'No visitados'
                            ]
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'Países (' + countryCodes.length + '/' + countries.length + ')'
                            },
                            responsive: true
                        }
                    });

                    var flags = "";
                    countries.forEach(country => {
                        if (countryCodes.includes(country.code)) {
                            flags += "<img src='./img/flags2/" + country.code + ".svg' width='30px' title='" + country.name + "' /> ";
                        } else {
                            flags += "<img class='img-grey' src='./img/flags2/" + country.code + ".svg' width='30px' title='" + country.name + "' /> ";
                        }
                    });
                    $('#flags').prepend(flags);
                },
                error: function() {
                    alert('Ha ocurrido un error inesperado al obtener la lista de paises');
                }
            });
        },
        error: function() {
            alert('Ha ocurrido un error inesperado al obtener tus paises visitados');
        }
    });

    $.ajax({
        type: "GET",
        url: Server + "/users/" + userId + "/regions",
        success: function(regions) {

            var ctx = $('#myChart2');
            var regionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [regions.length, 6 - regions.length],
                        backgroundColor: ['rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)']
                    }],
                    labels: [
                        'Visitados',
                        'No visitados'
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Continentes (' + regions.length + '/6)'
                    },
                    responsive: true
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