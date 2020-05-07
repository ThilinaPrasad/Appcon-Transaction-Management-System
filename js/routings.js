
connection = connChecker();

function statementPage(filter = "") {
    location.href = "statementPage.html?isRouted=true&filter="+filter;
}

function homePage() {
    location.href = "homeWindow.html?isRouted=true";
}

if(global_username === null && connection){
    login();
}else{
    $("#logged-user").html("Logged user: "+global_username+"&nbsp;<i class=\"fas fa-sign-out-alt\" id=\"log-out\"></i>\n");
    $("#logged-user").show();
}

// set loadedData
if (loadedData === null) {
    // fetch data from internet
        loadData();
}else{
    // fetch data from localstorage
    if(!isRouted) {
        $.confirm({
            theme: 'modern',
            icon: 'fas fa-database',
            title: 'Which data to use?',
            content: '<b>Database:</b> Used data from online database and update local database with new data.<br><b>Local:</b> Used previously used, locally stored data.',
            draggable: true,
            animationBounce: 2.5,
            type: 'blue',
            typeAnimated: true,
            buttons: {
                yes: {
                    text: 'Database',
                    btnClass: 'btn-green',
                    keys: ['enter'],
                    action: function () {
                        loadData();
                    },
                },
                no: {
                    text: 'Local',
                    btnClass: 'btn-blue',
                    action: function () {
                        bindDataToUI(loadedData);
                    },

                }
            }
        });
    } else {
        bindDataToUI(loadedData);
    }
}
