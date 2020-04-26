$(document).ready(function() {
    var userId = localStorage['userId'];

    if (userId === undefined) {
        window.location.href = "login.html";
    }

    $("#logout").click(function() {
        localStorage.removeItem('userId');
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
                                backgroundColor: ['rgb(85, 57, 115)', 'rgb(157, 104, 197)']
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
                            flags += "<img src='./img/flags2/" + country.code.toLowerCase() + ".svg' width='24px' title='" + country.name + "' /> ";
                        } else {
                            flags += "<img class='img-grey' src='./img/flags2/" + country.code.toLowerCase() + ".svg' width='24px' title='" + country.name + "' /> ";
                        }
                    });
                    $('#flags').prepend(flags);
                },
                error: function() {
                    swal("Ha ocurrido un error inesperado al obtener la lista de paises!", { icon: "error", });
                }
            });
        },
        error: function() {
            swal("Ha ocurrido un error inesperado al obtener tus paises visitados!", { icon: "error", });
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
                        backgroundColor: ['rgb(85, 57, 115)', 'rgb(137, 84, 197)']
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
            swal("Ha ocurrido un error inesperado!", { icon: "error", });
        }
    });
});

function getTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}