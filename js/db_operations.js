const END_POINT_URL = "https://script.google.com/macros/s/AKfycbwPP5zBQrAUUPuoMNuGk-W-rvFloILZnz2L6NPUuZ8_6r5Y8kO3/exec?action=";
function loadData() {
    $("#loading-row").show();
    $.get(END_POINT_URL+'read', function(data, status){
        const available_data = JSON.parse(data).records;
        if(available_data.length){
            $("#loading-row").hide();
        }else {
            $("#no-data-available-row").show();
        }
        for(let i=0; i<available_data.length; i++) {
            const html_table_row = "<tr id='row-id-"+available_data[i].Id+"' tabindex='0' class='text-center' data-toggle='modal' data-target='#viewRowModal' onclick='viewDataRow("+ JSON.stringify(available_data[i]) +")' >" +
                "            <td class='date search-active-data'>"+ available_data[i].Date +"</td>" +
                "            <td class='client'>"+ available_data[i].Client +"</td>" +
                "            <td class='project'>"+ available_data[i].Project +"</td>" +
                "            <td class='category'>"+ available_data[i].Category +"</td>" +
                "            <td class='description'>"+ available_data[i].Description +"</td>" +
                "            <td class='amount'>"+ parseFloat(available_data[i].Amount).toFixed(2) +"</td>\n" +
                "            <td class='person'>"+ available_data[i].Responsible_Person +"</td>" +
                "        </tr>";

            $("#data-table-body").append(html_table_row);
        }

    });
}

function addDataRow(dataString) {
    $("#save-btn-cont-general").hide();
    $("#save-btn-cont-animated").show();
    $("#save-btn").attr('disabled', true);
    $.get(END_POINT_URL+'insert&'+dataString, function (data, status) {
        const status_data = JSON.parse(data);
        if(status_data.response_status === 200){
            $.alert({
                theme: 'modern',
                icon: 'fa-check-circle-o',
                title: 'Success!',
                content: "Data row added successfully!",
                animationBounce: 2.5,
                type: 'green'
            });
            resetData('add');
        }else {
            $.alert({
                theme: 'modern',
                icon: 'fa-times-circle-o',
                title: 'Error!',
                content: "Error happened while data adding, Please try again later!",
                animationBounce: 2.5,
                type: 'red'
            });
        }
        $("#save-btn-cont-general").show();
        $("#save-btn-cont-animated").hide();
        $("#save-btn").attr('disabled', false);
    });
}

function deleteRow(id) {
    $("#delete-btn-cont-general").hide();
    $("#delete-btn-cont-animated").show();
    $("#delete-btn").attr('disabled', true);
    $.get(END_POINT_URL + 'delete&Id=' + id, function (data, status) {
        const status_data = JSON.parse(data);
        if(status_data.response_status === 200){
            $("#row-id-"+id).remove();
            $.alert({
                theme: 'modern',
                icon: 'fa-check-circle-o',
                title: 'Success!',
                content: "Data row deleted successfully!",
                animationBounce: 2.5,
                type: 'green'
            });
        }else {
            $.alert({
                theme: 'modern',
                icon: 'fa-times-circle-o',
                title: 'Error!',
                content: "Error happened while data adding, Please try again later!",
                animationBounce: 2.5,
                type: 'red'
            });
        }
        $("#delete-btn-cont-general").show();
        $("#delete-btn-cont-animated").hide();
        $("#delete-btn").attr('disabled', false);
        $('#viewRowModal').modal('hide');
    });
}

function updateDataRow(dataString) {
    $("#update-btn-cont-general").hide();
    $("#update-btn-cont-animated").show();
    $("#update-btn").attr('disabled', true);
    $.get(END_POINT_URL+'update&'+dataString, function (data, status) {
        const status_data = JSON.parse(data);
        if(status_data.response_status === 200){
            $.alert({
                theme: 'modern',
                icon: 'fa-check-circle-o',
                title: 'Success!',
                content: "Data row updated successfully!",
                animationBounce: 2.5,
                type: 'green'
            });
            resetData('add');
        }else {
            $.alert({
                theme: 'modern',
                icon: 'fa-times-circle-o',
                title: 'Error!',
                content: "Error happened while data updating, Please try again later!",
                animationBounce: 2.5,
                type: 'red'
            });
        }
        $("#update-btn-cont-general").show();
        $("#update-btn-cont-animated").hide();
        $("#update-btn").attr('disabled', false);
        toggleEditViewMode('view');
    });
}