const filter = JSON.parse(url.searchParams.get("filter"));
let filtered_data = JSON.parse(loadedData).records.sort(comp);
// filter title with input
console.log(filter);
$(".year").text(new Date().getFullYear());
if(filter.type === "complete"){
    $("#complete-title").show();
    displayStatement(filtered_data);
} else if (filter.type === "filtered") {
    $("#statement-client").text(filter.client);
    $("#statement-project-location").text(filter.projectLocation);
    $("#statement-project").text(filter.project);
    $("#filter-title").show();

    // filter data here and input to below function
    filtered_data = filterFromJsonArray(filtered_data, 'Client', filter.client);
    filtered_data = filterFromJsonArray(filtered_data, 'Project_Location', filter.projectLocation);
    filtered_data = filterFromJsonArray(filtered_data, 'Project', filter.project);
    displayStatement(filtered_data);
}


// calculate and display statement data based on inputted array
function displayStatement(filtered_data) {
    let total_expenses = 0;
    let expenses_html = "";
    let total_income = 0;
    let income_html = "";
    let profit_loss_value = 0;
    let profit_loss_text = "Profit/Loss";
    for (let i = 0; i < filtered_data.length; i++) {
        if(filtered_data[i].Transaction_Type === "" || filtered_data[i].Transaction_Type === "expense") {
            if(filtered_data[i].Amount !== "") {
                // console.log(parseFloat(filtered_data[i].Amount));
                total_expenses += parseFloat(filtered_data[i].Amount);
                expenses_html+="   <tr>\n" +
                    "                    <td class=\"description pl-3\">" + filtered_data[i].Description + "</td>\n" +
                    "                    <td class=\"text-right\">(" + parseFloat(filtered_data[i].Amount).toFixed(2) + ")</td>\n" +
                    "                </tr>";
            }
        } else if (filtered_data[i].Transaction_Type === "income"){
            total_income+=parseFloat(filtered_data[i].Amount);
            income_html+="   <tr>\n" +
                "                    <td class=\"description pl-3\">" + filtered_data[i].Description + "</td>\n" +
                "                    <td class=\"text-right\">" + parseFloat(filtered_data[i].Amount).toFixed(2) + "</td>\n" +
                "                </tr>";
        }
    }

    profit_loss_value = total_income - total_expenses;

    // Income bindings
    $("#income-descriptions").html(income_html);
    $("#descriptive-income-total-value").text(total_income.toFixed(2));
    $("#summary-income-total-value").text(total_income.toFixed(2));

    // Expenses bindings
    $("#expense-descriptions").html(expenses_html);
    $("#descriptive-expenses-total-value").text("("+total_expenses.toFixed(2)+")");
    $("#summary-expenses-total-value").text("("+total_expenses.toFixed(2)+")");

    // Profit-Loss bindings
    if(profit_loss_value>0){
        profit_loss_text = "Profit";
        $("#summary-profit-loss").addClass("text-success");
        $("#descriptive-profit-loss").addClass("text-success");
    } else if(profit_loss_value<0) {
        profit_loss_text = "Loss";
        profit_loss_value*=-1;
        $("#summary-profit-loss").addClass("text-danger");
        $("#descriptive-profit-loss").addClass("text-danger");
    }
    $("#summary-profit-loss-text").text(profit_loss_text);
    $("#descriptive-profit-loss-text").text(profit_loss_text);
    $("#descriptive-profit-loss-value").text(profit_loss_value.toFixed(2));
    $("#summary-profit-loss-value").text(profit_loss_value.toFixed(2));
}

