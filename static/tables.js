var tableurl = "http://127.0.0.1:5000//low_income_ca"
var tbody = d3.select("tbody");
var h3 = d3.select("h3");
// var data_pulled = undefined;

// const clone = JSON.parse(JSON.stringify(object))

d3.json(tableurl, function(h_data) {
    h_data.forEach(function(health_data){
        var addRow = tbody.append('tr');
        Object.entries(health_data).forEach(function([x,y]){
            addRow.append('td').text(y);
        })     
    });
    
    function buttonClicked(){
        d3.event.preventDefault();
        // Select the input element and get the raw HTML node
        var inputElement = d3.select('#healthvalue');
    
        // Get the value property of the input element
        var inputValue = inputElement.property("value");
    
        // Print the value to the console
        console.log(inputValue);
    
        var tableDataFiltered = h_data.filter(health => (health.county).toLowerCase() === inputValue.toLowerCase());
        console.log(tableDataFiltered);
        tbody.html("")
        
        tableDataFiltered.forEach(function(h_data){
            var addRow = tbody.append('tr')
            Object.entries(h_data).forEach(function([x,y]){
                addRow.append('td').text(y);
            });
        });
    };
    
    button.on('click', buttonClicked)
});


var button = d3.select("#filter-btn");
var form = d3.select('#form');



