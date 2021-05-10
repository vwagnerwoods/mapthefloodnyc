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
 * Add event listener to the map that updates the latitude and longitude on the form
 */

var latitudeField = document.querySelector('.latitude-field');
var longitudeField = document.querySelector('.longitude-field');

var markerLayer = L.featureGroup().addTo(map);

map.on('click', function (event) {
  // Clear the existing marker
  markerLayer.clearLayers();
  
  // Log out the latlng so we can see that it's correct
  console.log(event.latlng);
  
  // Add a marker to the map
  var marker = L.marker(event.latlng);
  markerLayer.addLayer(marker);
  
  // Update the form fields
  latitudeField.value = event.latlng.lat;
  longitudeField.value = event.latlng.lng;
});