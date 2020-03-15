function doGet(e){

    var op = e.parameter.action;

    // load spread sheet
    var ss=SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rMfnPHD4tAZZX-Hp9u8L3j40GU08Cqemqr38FogZcdU/edit?ts=5e6ce7a4#gid=0");

    // select sheet
    var cur_date = new Date();
    var sheetName =cur_date.getFullYear().toString();
    var sheets = ss.getSheets();
    var sheetNames = [];
    for(var i=0;i<sheets.length; i++){
        sheetNames.push(sheets[i].getName());
    }
    var sheet = null;
    if(sheetNames.includes(sheetName)){
        sheet = ss.getSheetByName(sheetName);
    }else{
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(["Id","Date", "Client", "Project", "Category", "Description", "Amount", "Responsible Person", "created_by", "created_on", "updated_by", "updated_on"]);
    }

    // crud operations
    if(op=="insert"){
        return insert_value(e,sheet);
    }
    // for read action there is a optional parameter called sheetName to specify custom name
    if(op=="read"){
        return read_value(e,ss,sheetName);
    }
    if(op=="update"){
        return update_value(e,sheet);
    }
    if(op=="delete"){
        return delete_value(e,sheet);
    }
}

// Insert data row
function insert_value(request,sheet){
    var date = request.parameter.Date;
    var client = request.parameter.Client;
    var project = request.parameter.Project;
    var category = request.parameter.Category;
    var description = request.parameter.Description;
    var amount = request.parameter.Amount;
    var responsible_person = request.parameter.Responsible_person;
    var created_on = new Date().toString();
    var created_by = request.parameter.created_by;
    var updated_by = request.parameter.updated_by;
    var updated_on = "";

    var flag=1;
    var result={
        "response_status": 404,
        "response_data": "Bad request!"
    };
    var lr= sheet.getLastRow();
    //add new row with recieved parameter from client
    if(flag==1){
        var rowData = sheet.appendRow([(lr+1),date,client,project,category,description,amount,responsible_person,created_by,created_on,updated_by,updated_on]);
        result = {
            "response_status": 200,
            "response_data": "Successfully added!"
        }
    }else{
        result = {
            "response_status": 500,
            "response_data": "Internerl error, Please try again!"
        }
    }
    result = JSON.stringify(result);
    return ContentService
        .createTextOutput(result)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}


// read all data
function read_value(request,ss,sheetName){
    var output  = ContentService.createTextOutput(),
        data    = {};
    var customSheetName = request.parameter.sheetName;

    //Note : here sheet is sheet name , don't get confuse with other operation
    var sheet=sheetName;
    if(customSheetName){
        sheet=customSheetName;
    }

    data.records = readData_(ss, sheet);

    var callback = request.parameters.callback;

    if (callback === undefined) {
        output.setContent(JSON.stringify(data));
    } else {
        output.setContent(callback + "(" + JSON.stringify(data) + ")");
    }
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);

    return output;
}

function readData_(ss, sheetname, properties) {

    if (typeof properties == "undefined") {
        properties = getHeaderRow_(ss, sheetname);
        properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
    }

    var rows = getDataRows_(ss, sheetname);
    data = [];
    for (var r = 0, l = rows.length; r < l; r++) {
        var row     = rows[r],
            record  = {};

        for (var p in properties) {
            record[properties[p]] = row[p];
        }

        data.push(record);

    }
    return data;
}



function getDataRows_(ss, sheetname) {
    try {
        var sh = ss.getSheetByName(sheetname);
        return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    }catch(err){
        return [];
    }
}


function getHeaderRow_(ss, sheetname) {
    var sh = ss.getSheetByName(sheetname);
    return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}


//update data row
function update_value(request,sheet){

    var output  = ContentService.createTextOutput();
    var id = request.parameter.Id;
    var date = request.parameter.Date;
    var client = request.parameter.Client;
    var project = request.parameter.Project;
    var category = request.parameter.Category;
    var description = request.parameter.Description;
    var amount = request.parameter.Amount;
    var responsible_person = request.parameter.Responsible_person;
    var updated_by = request.parameter.updated_by;
    var updated_on = new Date().toString();
    var flag=0;
    var result = {
        "response_status": 404,
        "response_data": "Not found!"
    }
    var country = request.parameter.name;
    var lr= sheet.getLastRow();
    for(var i=1;i<=lr;i++){
        var rid = sheet.getRange(i, 1).getValue();
        if(rid==id){
            sheet.getRange(i,2).setValue(date);
            sheet.getRange(i,3).setValue(client);
            sheet.getRange(i,4).setValue(project);
            sheet.getRange(i,5).setValue(category);
            sheet.getRange(i,6).setValue(description);
            sheet.getRange(i,7).setValue(amount);
            sheet.getRange(i,8).setValue(responsible_person);
            sheet.getRange(i,11).setValue(updated_by);
            sheet.getRange(i,12).setValue(updated_on);
            result = {
                "response_status": 200,
                "response_data": "Successfully updated!"
            }
            flag=1;
        }
    }
    if(flag==0)
        result = {
            "response_status": 404,
            "response_data": "Data row not found!"
        }

    result = JSON.stringify(result);

    return ContentService
        .createTextOutput(result)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);


}


function delete_value(request,sheet){

    var output  = ContentService.createTextOutput();
    var id = request.parameter.Id;
    var result = {
        "response_status": 404,
        "response_data": "Not found!"
    }
    var flag=0;

    var lr= sheet.getLastRow();
    for(var i=1;i<=lr;i++){
        var rid = sheet.getRange(i, 1).getValue();
        if(rid==id){
            sheet.deleteRow(i);
            result = {
                "response_status": 200,
                "response_data": "Successfully Deleted!"
            }
            flag=1;
        }

    }

    if(flag==0)
        result = {
            "response_status": 404,
            "response_data": "Data row not found!"
        };



    result = JSON.stringify(result);

    return ContentService
        .createTextOutput(result)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
