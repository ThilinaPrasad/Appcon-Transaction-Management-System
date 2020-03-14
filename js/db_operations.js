const END_POINT_URL = "https://script.google.com/macros/s/AKfycbwPP5zBQrAUUPuoMNuGk-W-rvFloILZnz2L6NPUuZ8_6r5Y8kO3/exec?action=";
function loadData() {
    $.get(END_POINT_URL+'read', function(data, status){
        const available_data = JSON.parse(data).records;
        if(available_data.length){
            $("#no-data-available-row").remove();
        }
        for(var i=0;i<available_data.length;i++) {

            const html_table_row = '<tr tabindex="0" class="text-center" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true"\n' +
                '            data-content=\'\n' +
                '<div class="btn-group" role="group">\n' +
                '  <button type="button" class="btn btn-success btn-sm" onclick="editRow("'+ available_data[i].created_on.toString() +'")"><i class="fas fa-edit"></i></button>\n' +
                '  <button type="button" class="btn btn-danger btn-sm" onclick="deleteRow("'+ available_data[i].created_on.toString() +'")"><i class="fas fa-trash-alt"></i></button>\n' +
                '</div>\n' +
                '\'>\n' +
                '            <td class="date search-active-data">'+ available_data[i].Date +'</td>\n' +
                '            <td class="client">'+ available_data[i].Client +'</td>\n' +
                '            <td class="project">'+ available_data[i].Project +'</td>\n' +
                '            <td class="category">'+ available_data[i].Category +'</td>\n' +
                '            <td class="description">'+ available_data[i].Description +'</td>\n' +
                '            <td class="amount">'+ available_data[i].Amount +'</td>\n' +
                '            <td class="person">'+ available_data[i].Responsible_Person +'</td>\n' +
                '        </tr>';

            $("#data-table-body").append(html_table_row);
        }

    });
}

function addDataRow(dataString) {
    $.get(END_POINT_URL+'insert&'+dataString, function (data, status) {
        const status_data = JSON.parse(data);
        if(status_data.response_status === 200){
            $.alert({
                theme: 'modern',
                icon: 'fa-check-circle-o',
                title: 'Success!',
                content: "Data row added successfully!",
                animationBounce: 2.5,
                type: 'green',
            });
        }else {
            $.alert({
                theme: 'modern',
                icon: 'fa-times-circle-o',
                title: 'Error!',
                content: "Error happened while data adding, Please try again later!",
                animationBounce: 2.5,
                type: 'red',
            });
        }
    });
}
