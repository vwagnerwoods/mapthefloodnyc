/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// This isn't necessary but it keeps the editor from thinking L and carto are typos
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

/*
 * Begin layer one
 */

// Initialze source data
var waterSource = new carto.source.SQL("SELECT * FROM water2050");

// Create style for the data
var waterStyle = new carto.style.CartoCSS(`
  #layer {
  line-color: #000000;
   line-width: 0.5px;
   polygon-fill: #000000;
   polygon-opacity: 5000;
  }
`);

// Add style to the data
var waterlayer = new carto.layer.Layer(waterSource, waterStyle);

/*
 * Begin layer two
 */

// Initialze data source
var AirBnBsource = new carto.source.SQL("SELECT * FROM large_new_developments");

// Create style for the data
var AirBnBstyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: 5;
  marker-fill: #A7FF19;
  marker-fill-opacity: 0.8;
  marker-allow-overlap: true;
  marker-line-width: 0.1;
  marker-line-color: #000000;
  marker-line-opacity: 1;
  }
`);

// Add style to the data
var AirBnBlayer = new carto.layer.Layer(AirBnBsource, AirBnBstyle);

/*
 * Begin layer three
 */

// Initialze source data
var neighborhoodSource = new carto.source.SQL("SELECT * FROM sandydamaged WHERE show = 'yes'");

// Create style for the data
var neighborhoodStyle = new carto.style.CartoCSS(`
  #layer {
  line-color: #FAA300;
   line-width: 2px;
   polygon-opacity: 50000000;
  }
`);

// Add style to the data
var neighborhoodlayer = new carto.layer.Layer(neighborhoodSource, neighborhoodStyle);

// Add the data to the map 
client.getLeafletLayer().addTo(map);

// ALL NEW BUILDINGS BUTTON
var resetButton = document.querySelector(".reset-button");

resetButton.addEventListener("click", function() {
  AirBnBsource.setQuery("SELECT * FROM large_new_developments");

  console.log("reset was clicked");
});

// RESIDENTIAL BUTTON
var residentialButton = document.querySelector(".residential-button");

residentialButton.addEventListener("click", function(e) {
  AirBnBsource.setQuery(
    "SELECT * FROM vicwoods.large_new_developments WHERE proposed_occupancy_class LIKE '%RESIDENTIAL%'"
  );

  console.log("residential was clicked");
});

// COMMERCIAL BUTTON
var commercialButton = document.querySelector(".commercial-button");

commercialButton.addEventListener("click", function(e) {
  AirBnBsource.setQuery(
    "SELECT * FROM vicwoods.large_new_developments WHERE proposed_occupancy_class LIKE '%COMMERCIAL%' OR proposed_occupancy_class LIKE '%BUSINESS%'"
  );

  console.log("commercial was clicked");
});

// slider

var priceSlider = document.getElementById("price-slider");
noUiSlider.create(priceSlider, {
  start: [0, 5000000],
  orientation: 'vertical',
  direction: 'rtl',
  connect: true,
  range: {
    min: 0,
    max: 5000000
  },
  tooltips: false,

  pips: {
    mode: "positions",
    values: [0, 25, 50, 75, 100],
    density: 5,

    format: {
      to: function(value) {
        return "$" + value;
      },
      from: function(value) {
        return +value;
        ("+");
      }
    }
  }
});

priceSlider.noUiSlider.on("change", function() {
  var priceValues = priceSlider.noUiSlider.get();
  AirBnBsource.setQuery(
    "SELECT * FROM large_new_developments WHERE cost_estimate >= " +
      priceValues[0] +
      " AND cost_estimate <= " +
      priceValues[1]
  );
});

/*modal*/

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("popup");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//POPUP JS , 'cost_estimate', 'square_footage', 'proposed_occupancy_class'

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var AirBnBlayer = new carto.layer.Layer(AirBnBsource, AirBnBstyle, {
  featureClickColumns: [
    "borough",
    "cost_estimate",
    "square_footage",
    "proposed_occupancy_class"
  ]
});

AirBnBlayer.on("featureClicked", function(event) {
  // Create the HTML that will go in the popup. event.data has all the data for
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = "<h4>Borough:</h4> <h3>" + event.data["borough"] + "</h3>";
  content +=
    "<p> <h4>Construction Cost Estimate:</h4> <h3>" +
    "$" +
    event.data["cost_estimate"] +
    "</h3> </p>";
  content +=
    "<p> <h4>Square Footage:</h4> <h3>" +
    event.data["square_footage"] +
    " sq. ft.</h3> </p>";
  content +=
    "<p> <h4>Occupancy Type:</h4> <h3>" +
    event.data["proposed_occupancy_class"] +
    "</h3> </p>";

  // If you're not sure what data is available, log it out:
  console.log(event.data);

  var popup = L.popup();
  popup.setContent(content);

  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as three layers. Order matters here--first one goes on the bottom
client.addLayers([waterlayer, neighborhoodlayer, AirBnBlayer]);
client.getLeafletLayer().addTo(map);