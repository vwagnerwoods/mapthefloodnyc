/* global L, carto, noUiSlider */

var map = L.map("map", {
  center: [40.690046, -74.02341],
  zoom: 11.8
});
map.zoomControl.setPosition("topright");

// Add base layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/vicwoods/ckmy6uals1ji417lk76165pi2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoidmljd29vZHMiLCJhIjoiY2tteGo1ZXlxMG51aDJ1cGVmZGtpd2U1MSJ9.Ux9erlyBJOT4_QZ3KgkNdQ",
  {
    maxZoom: 18
  }
).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: "default_public",
  username: "vicwoods"
});

// Initialze data source
var contactSource = new carto.source.SQL(
  "SELECT * FROM vicwoods.contact_final_responses"
);

// Create style for the data
var contactStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 15;
  marker-fill: #ca454f;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var contactlayer = new carto.layer.Layer(contactSource, contactStyle);

// Add the data to the map
client.addLayers([contactlayer]);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Make SQL to get the summary data you want
var countSql = "SELECT COUNT(*) FROM large_new_developments";

// Request the data from Carto using fetch.
fetch("https://vicwoods.carto.com/api/v2/sql/?q=" + countSql)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // All of the data returned is in the response variable
    console.log(data);

    // The sum is in the first row's sum variable
    var count = data.rows[0].count;

    // Get the sidebar container element
    var sidebarContainer = document.querySelector(".sidebar-feature-content");

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML =
      "<div>As of March 30th, 2021, <u><b>" +
      count +
      "</u></b> buildings are actively being constructed in New York City.</div>";
  });