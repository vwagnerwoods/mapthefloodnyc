/* global L, carto, noUiSlider */

var map = L.map("map", {
  center: [40.690046, -74.02341],
  zoom: 10.5
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
  "SELECT * FROM vicwoods.contact_final_responses WHERE mapped = 'x'"
);

// Create style for the data
var contactStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 15;
  marker-file: url('https://cdn.glitch.com/f9625d8f-3bfa-4918-bd97-0430d1d1fb7b%2Fletter.svg');
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #000000;
  marker-line-opacity: 1;
}
`);

var contactlayer = new carto.layer.Layer(contactSource, contactStyle);

/*
 * Begin layer two
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


//POPUP JS , 'cost_estimate', 'square_footage', 'proposed_occupancy_class'

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var contactlayer = new carto.layer.Layer(contactSource, contactStyle, {
  featureClickColumns: [
    "name_alias",
    "if_yes_what_was_the_name_of_the_place",
    "describe_how_the_flooding_event_affected_you_and_or_the_place",
                        ]
});

contactlayer.on("featureClicked", function(event) {
  // Create the HTML that will go in the popup. event.data has all the data for
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = "<h2><small>" + event.data["if_yes_what_was_the_name_of_the_place"] + "</small><h2>";
  content += "<p> " + "<h3>" + event.data["describe_how_the_flooding_event_affected_you_and_or_the_place"] + " </h3></p>";
  content += "<p> <h2><small>-" + event.data["name_alias"] + " </small></h2></p>";

  // If you're not sure what data is available, log it out:
  console.log(event.data);

  var popup = L.popup();
  popup.setContent(content);

  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map
client.addLayers([waterlayer, neighborhoodlayer, contactlayer]);
client.getLeafletLayer().addTo(map);
