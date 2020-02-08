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

$("#signIn").on('click',function() {
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
