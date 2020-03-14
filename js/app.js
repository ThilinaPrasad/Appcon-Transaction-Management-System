// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('DB/DB.db');

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

$(function () {
    $('[data-toggle="popover"]').popover();
});

$('.popover-dismiss').popover({
    trigger: 'focus'
});

$("#signIn").on('click', function () {
    $.alert({
        title: 'Alert!',
        content: 'Simple alert!',
    });
});

$("#search-filter").change(function () {
    $("#search-query").attr("placeholder", "Search by " + $("#search-filter").val());
});

function editRow(id) {
    alert(id);
}

function deleteRow(id) {
    $.confirm({
        theme: 'supervan',
        icon: 'fa fa-trash-alt',
        title: 'Delete Data',
        content: "You want to delete this row?",
        draggable: true,
        animationBounce: 2.5,
        type: 'red',
        typeAnimated: true,
        buttons: {
            Delete: {
                text: 'Delete',
                btnClass: 'btn-danger btn-sm',
                action: function () {
                    // add delete fn here
                    $.alert({
                        content: id,
                    });
                }
            },
            Cancel: {
                text: 'Cancel',
                btnClass: 'btn-sm',
            }
        }
    });
}

loadData();

// filter data
// function filterData() {
//     var input, filter, table, tr, td, i, txtValue;
//     input = document.getElementById("search-query");
//     filter = input.value.toUpperCase();
//     table = document.getElementById("data-table-body");
//     tr = table.getElementsByTagName("tr");
//     for (i = 0; i < tr.length; i++) {
//         td = tr[i].getElementsByTagName("td")[1];
//         if (td) {
//             txtValue = td.textContent || td.innerText;
//             if (txtValue.toUpperCase().indexOf(filter) > -1) {
//                 tr[i].style.display = "";
//             } else {
//                 tr[i].style.display = "none";
//             }
//         }
//     }
// }

function changeFilterColumn() {
    const column = $("#search-filter").val().toLowerCase();
    $(".search-by-date").removeClass('search-active-col');
    $(".search-by-client").removeClass('search-active-col');
    $(".search-by-project").removeClass('search-active-col');
    $(".search-by-category").removeClass('search-active-col');
    $(".search-by-description").removeClass('search-active-col');
    $(".search-by-amount").removeClass('search-active-col');
    $(".search-by-person").removeClass('search-active-col');

    $(".date").removeClass('search-active-data');
    $(".client").removeClass('search-active-data');
    $(".project").removeClass('search-active-data');
    $(".category").removeClass('search-active-data');
    $(".description").removeClass('search-active-data');
    $(".amount").removeClass('search-active-data');
    $(".person").removeClass('search-active-data');

    $(".search-by-" + column).addClass('search-active-col');
    $("." + column).addClass('search-active-data');
}

function filterData() {
    const search_query = $("#search-query").val().toLowerCase();
    const column = $("#search-filter").val().toLowerCase();
    $("#data-table-body tr").filter(function () {
        $(this).toggle($(this).find('td.' + column).text().toLowerCase().indexOf(search_query) > -1);
    });
}

function getDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function saveData() {
    if ($("#add-date").val() || $("#add-client").val() || $("#add-project").val() || $("#add-category").val() || $("#add-description").val() || $("#add-amount").val() || $("#add-person").val()) {
        const dataString = "Date=" + $("#add-date").val() + "&Client=" + $("#add-client").val() + "&Project=" + $("#add-project").val() + "&Category=" + $("#add-category").val() + "&Description=" + $("#add-description").val() +
            "&Amount=" + $("#add-amount").val() + "&Responsible_person=" + $("#add-person").val() + "&created_by=system_user&updated_by=";
        addDataRow(dataString);
    } else {
        $.alert({
            theme: 'modern',
            icon: 'fa-times-circle-o',
            title: 'Empty Data!',
            content: "All data can not be empty!",
            animationBounce: 2.5,
            type: 'red',
        });
    }
}
