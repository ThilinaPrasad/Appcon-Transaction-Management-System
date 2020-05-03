// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('DB/DB.db');
let global_username = "system_user"
// login
function login() {
    $.confirm({
        theme: 'modern',
        icon: 'fas fa-user-circle',
        title: 'Please Enter your user name',
        content: '<input type="text" placeholder="User name" id="user-name" class="del-pass form-control is-valid" required style="text-align:center;" autofocus>',
        draggable: true,
        animationBounce: 2.5,
        type: 'green',
        typeAnimated: true,
        buttons: {
            Delete: {
                text: 'Login',
                btnClass: 'btn-green',
                keys: ['enter'],
                action: function () {
                    var username = this.$content.find('#user-name').val();
                    if (username === '') {
                        login();
                    }else{
                        global_username = username;
                        $("#logged-user").html("Logged user: "+username+"&nbsp;<i class=\"fas fa-sign-out-alt\" id=\"log-out\"></i>\n");
                        $("#logged-user").show();
                    }
                },

            }
        }
        });
}

login();
// Internet Connection checker
function checkNetConnection() {
    var xhr = new XMLHttpRequest();
    var file = "https://www.google.com/maps";
    var r = Math.round(Math.random() * 10000);
    xhr.open('HEAD', file + "?subins=" + r, false);
    try {
        xhr.send();
        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

function connChecker() {
    if (!checkNetConnection()) {
        $.confirm({
            theme: 'supervan',
            title: 'Please check your internet connection!',
            content: 'Please connect to internet before running this app!',
            columnClass: 'small',
            buttons: {
                tryAgain: {
                    text: 'Try Again!',
                    btnClass: 'btn-red',
                    keys: ['enter'],
                    action: function () {
                        connChecker();
                        location.reload();
                    }
                }
            }
        });
    }
}

connChecker();

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


loadData();

function addDataModel() {
    $("#add-date").val(reformatDateToInputField((new Date()).toString()));
}

function changeFilterColumnByDropdown() {
    changeFilterColumn($("#search-filter").val().toLowerCase());
}

function changeFilterColumn(column, changeDropdown=false) {
    $(".search-by-date").removeClass('search-active-col');
    $(".search-by-client").removeClass('search-active-col');
    $(".search-by-project-location").removeClass('search-active-col');
    $(".search-by-project").removeClass('search-active-col');
    $(".search-by-category").removeClass('search-active-col');
    $(".search-by-description").removeClass('search-active-col');
    $(".search-by-amount").removeClass('search-active-col');
    $(".search-by-trans-type").removeClass('search-active-col');
    $(".search-by-person").removeClass('search-active-col');

    $(".date").removeClass('search-active-data');
    $(".client").removeClass('search-active-data');
    $(".project-location").removeClass('search-active-data');
    $(".project").removeClass('search-active-data');
    $(".category").removeClass('search-active-data');
    $(".description").removeClass('search-active-data');
    $(".amount").removeClass('search-active-data');
    $(".trans-type").removeClass('search-active-data');
    $(".person").removeClass('search-active-data');

    $(".search-by-" + column).addClass('search-active-col');
    $("." + column).addClass('search-active-data');

    const replaced_values = {
        "date": "Date",
        "client": "Client",
        "project-location": "Project Location",
        "project": "Project",
        "category": "Category",
        "description": "Description",
        "amount": "Amount",
        "trans-type": "Ex/In",
        "person": "Person",
    };

    $("#search-query").attr("placeholder", "Search by " + replaced_values[column]);
    $("#search-query").val('');

    if(changeDropdown) {
        $("#search-filter").val(column);
    }
    if(isDownloadEnabled) {
        tables.remove();
        isDownloadEnabled = false;
    }
}

function filterData() {
    const search_query = $("#search-query").val().toLowerCase();
    const column = $("#search-filter").val().toLowerCase();
    if(isDownloadEnabled) {
        tables.remove();
        isDownloadEnabled = false;
    }
    if(column === "trans-type"){
        $("#data-table-body tr").filter(function () {
            const togglingVal = $(this).find('td.' + column+ ' span').text().toLowerCase().indexOf(search_query) > -1;
            $(this).toggle(togglingVal);
            $(this).toggleClass('tableexport-ignore', !togglingVal);
        });
    }
    else {
        $("#data-table-body tr").filter(function () {
            const togglingVal = $(this).find('td.' + column).text().toLowerCase().indexOf(search_query) > -1;
            $(this).toggle(togglingVal);
            $(this).toggleClass('tableexport-ignore', !togglingVal);
        });
    }
    $("#no-data-available-row").hide();
    $("#loading-row").hide();
}

function formatDate(date, timestamp = false) {
    let today = new Date(date);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (timestamp) {
        return dd + '/' + mm + '/' + yyyy + ", " + today.toLocaleTimeString('si-LK');
    } else {
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }
}

function saveData() {
    if ($("#add-date").val() || $("#add-client").val() || $("#add-project-location").val() || $("#add-project").val() || $("#add-category").val() || $("#add-description").val() || $("#add-amount").val() || $("#add-person").val()) {
        const dataString = "Date=" + $("#add-date").val() + "&Client=" + $("#add-client").val() + "&Project_location=" + $("#add-project-location").val() + "&Project=" + $("#add-project").val() + "&Category=" + $("#add-category").val() + "&Description=" + $("#add-description").val() +
            "&Amount=" + $("#add-amount").val() + "&Transaction_type=" + $('input[name=add-trans-type]:checked').val() + "&Responsible_person=" + $("#add-person").val() + "&created_by="+global_username+"&updated_by=";
        addDataRow(dataString);
    } else {
        $.alert({
            theme: 'modern',
            icon: 'fa-times-circle-o',
            title: 'Empty Data!',
            content: "All data can not be empty!",
            animationBounce: 2.5,
            type: 'red'
        });
    }
}

function resetData(type) {
    $("#" + type + "-date").val('');
    $("#" + type + "-client").val('');
    $("#" + type + "-project").val('');
    $("#" + type + "-category").val('');
    $("#" + type + "-description").val('');
    $("#" + type + "-amount").val('');
    $("#" + type + "-person").val('');

}

function refreshData() {
    $("#data-table-body").empty();
    $("#data-table-body").append("<tr class=\"text-center tableexport-ignore\" id=\"loading-row\">\n" +
        "            <td colspan=\"8\"><i class=\"fas fa-spinner animate-rotate\"></i>&nbsp;&nbsp;Loading data. Please wait...</td>\n" +
        "        </tr>");
    loadData();

    changeFilterColumn('date', true);
}

function reformatDateToInputField(date) {
    const now = new Date(date);
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    return (day) + "/" + (month) + "/" + now.getFullYear();
}

function viewDataRow(row) {
    // clear data
    resetData('view');
    $("#view-id").val("");
    $("#view-created-by").val("");
    $("#view-created-on").val("");
    $("#view-updated-by").val("");
    $("#view-updated-on").val("");

    // set data
    $("#view-id").val(row.Id);
    $("#view-date").val(row.Date);
    $("#view-client").val(row.Client);
    $("#view-project-location").val(row.Project_Location);
    $("#view-project").val(row.Project);
    $("#view-category").val(row.Category);
    $("#view-description").val(row.Description);
    $("#view-amount").val(parseFloat(row.Amount).toFixed(2));
    if(row.Transaction_Type === 'income'){
        $("#view-income").prop("checked", true);
    }else {
        $("#view-expense").prop("checked", true);
    }
    $("#view-person").val(row.Responsible_Person);
    $("#view-created-by").val(row.created_by);
    $("#view-created-on").val(formatDate(row.created_on, true));
    $("#view-updated-by").val(row.updated_by);
    $("#view-updated-on").val(formatDate(row.updated_on, true));
}

function toggleEditViewMode(mode) {
    if (mode === 'view') {
        $("#update-component-btn-group").hide();
        $("#view-component-btn-group").show();
        $("#system-gen-data-section").show();
        $("#view-model-title").text('View Record');

        $("#view-date").attr('readonly', true);
        $("#view-client").attr('readonly', true);
        $("#view-project-location").attr('readonly', true);
        $("#view-project").attr('readonly', true);
        $("#view-category").attr('readonly', true);
        $("#view-description").attr('readonly', true);
        $("#view-amount").attr('readonly', true);
        $("#view-expense").attr('disabled', true);
        $("#view-income").attr('disabled', true);
        $("#view-person").attr('readonly', true);
    } else if (mode === 'edit') {
        $("#view-component-btn-group").hide();
        $("#system-gen-data-section").hide();
        $("#view-model-title").text('Edit Record');
        $("#update-component-btn-group").show();

        $("#view-date").attr('readonly', false);
        $("#view-client").attr('readonly', false);
        $("#view-project-location").attr('readonly', false);
        $("#view-project").attr('readonly', false);
        $("#view-category").attr('readonly', false);
        $("#view-description").attr('readonly', false);
        $("#view-amount").attr('readonly', false);
        $("#view-expense").attr('disabled', false);
        $("#view-income").attr('disabled', false);
        $("#view-person").attr('readonly', false);
    }
}

function deleteData() {
    $("#row-id-" + $("#view-id").val()).addClass("bg-danger");
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
                    deleteRow($("#view-id").val());
                }
            },
            Cancel: {
                text: 'Cancel',
                btnClass: 'btn-sm',
                action: function () {
                    $("#row-id-" + $("#view-id").val()).removeClass("bg-danger");
                }
            }
        }
    });
}

function updateSave() {
    console.log($("#view-project-location").val());
    if ($("#view-date").val() || $("#view-client").val() || $("#view-project-location").val() || $("#view-project").val() || $("#view-category").val() || $("#view-description").val() || $("#view-amount").val() || $("#view-person").val()) {
        const dataString = "Id=" + $("#view-id").val() + "&Date=" + $("#view-date").val() + "&Client=" + $("#view-client").val()+ "&Project_location=" + $("#view-project-location").val() + "&Project=" + $("#view-project").val() + "&Category=" + $("#view-category").val() + "&Description=" + $("#view-description").val() +
            "&Amount=" + $("#view-amount").val() + "&Transaction_type=" + $('input[name=view-trans-type]:checked').val() + "&Responsible_person=" + $("#view-person").val() + "&updated_by="+global_username;
        updateDataRow(dataString);
    } else {
        $.alert({
            theme: 'modern',
            icon: 'fa-times-circle-o',
            title: 'Empty Data!',
            content: "All data can not be empty!",
            animationBounce: 2.5,
            type: 'red'
        });
    }
}

let isDownloadEnabled = false;
let tables;
function exportTableToExcel(tableID){
    if(!isDownloadEnabled) {
        tables = $("#" + tableID).tableExport({
            bootstrap: false,
            headings: true,
            footers: true,
            formats: ["xlsx", "xls", "csv", "txt"],
            fileName: $("#search-query").val().length? "Appcon Daily Accounts Details(filter='"+$("#search-filter").val().toLowerCase()+"',value='"+$("#search-query").val().toLowerCase()+"')": "Appcon Daily Accounts Details(All)",
            position: "top",
            ignoreRows: null,
            ignoreCols: null,
            ignoreCSS: ".tableexport-ignore",
            emptyCSS: ".tableexport-empty",
            trimWhitespace: true
        }, true);
        isDownloadEnabled = true;
    }else {
        tables.remove();
        isDownloadEnabled = false;
    }
}
