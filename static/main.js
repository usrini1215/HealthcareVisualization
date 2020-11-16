// Creating map object
var myMap = L.map("mapid", {
    center: [38.5816, -121.4944],
    zoom: 6
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var hospitalIcon = L.icon({
    iconUrl: 'static/hospital.svg',
    //shadowUrl: 'static/hospital.svg',
    iconSize:     [25, 50], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [24, 34], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

var scrape_medical_county = "http://127.0.0.1:5000/medical_county"
d3.json(scrape_medical_county, function(medical_co) {
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();
  // Loop through data
  for (var i = 0; i < medical_co.length; i++) {
  // Set the data location property to a variable
    var serviceProvider = medical_co[i].Provider;
    var services = medical_co[i].Services;
    // console.log(services)
    var latitude = medical_co[i].Latitute;
    var longitude = medical_co[i].Longitude;
    var object = medical_co[i];

    // Check for location property
    if (latitude && longitude) {
      if (services == 'Health Services'){
        markers.addLayer(
        L.marker([latitude, longitude], {icon: hospitalIcon}).addTo(myMap).bindPopup("Health Service"));
      }
      else 
      {
        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([latitude, longitude])
          .bindPopup("<h1>" + serviceProvider + "</h1> <hr> <h3>Services: " + services + "</h3>"));
        };
    }
  };
  myMap.addLayer(markers);

});

var scrape_medically_underserved = "http://127.0.0.1:5000/medically_underserved"
d3.json(scrape_medically_underserved, function(underserved) {
  L.geoJson(underserved).addTo(myMap);
});

var scrape_low_income_race = "http://127.0.0.1:5000/low_income_race"
function buildPlot2() {
  d3.json(scrape_low_income_race, function (race_data) {
    var race = []
    var percent_race = []

    for (var i = 0; i < race_data.length; i++) {
      race.push(race_data[i].race)
      percent_race.push(race_data[i].percent_of_families_below_the_living_wage)
    }
    
    var trace2 = {
      type: "bar",
      x: race,
      y: percent_race,
      name: 'AIAN: American Indian; NHOPI: Native Hawaiian'
  }

    var layout2 = {
      title: "Percent of Families Living Below the Living Wage in California by Race",
      yaxis: {title: "Percent (%)"},
      showlegend : true, 
      legend: { xanchor: 'center', x: 0.5, orientation: 'h' } 
    }

    Plotly.newPlot("bar2", [trace2], layout2);

  });

}
buildPlot2()


var scrape_low_income_ca = "http://127.0.0.1:5000/low_income_ca"
function buildPlot() {
  d3.json(scrape_low_income_ca, function(ca_data) {
    // Grab values from the data json object to build the plots
    var data = ca_data;
    data.sort(function(a, b) {
      return parseFloat(b.percent_of_families_below_the_living_wage) - parseFloat(a.percent_of_families_below_the_living_wage);
    });
    
    var family = []
    var county = []

    for (var i = 0; i < ca_data.length; i++) {

      family.push(ca_data[i].percent_of_families_below_the_living_wage);
      county.push(ca_data[i].county)

      };

      transform = [{
        type: 'sort',
        target: family,
        order: 'descending'
      }];

      var trace1 = {
        type: "bar",
        x: county,
        y: family,
        name :"CA Counties"
      };
      
      var layout = {
        title: "Percent of Families Living Below the Living Wage in California Counties",
        yaxis: {title: "Percent (%)"},
        showlegend : true
        // type: "total descending"
        // yaxis: dict(autorange="reversed")
      };
    
    // fig.update_layout(xaxis={'categoryorder':'category ascending'})
    // console.log(family)
    // console.log(race_data[0].county)
    // console.log(race_data[0].families_below_the_living_wage)
    
    // Plotly.newPlot('graph', [{
    //   type: 'bar',
    //   y: family,
    //   transforms: [{
    //     type: 'sort',
    //     target: 'y',
    //     order: 'descending'
    //   }]
    // }]);


    Plotly.newPlot("bar", [trace1], layout, transform);

    });
  };

buildPlot();