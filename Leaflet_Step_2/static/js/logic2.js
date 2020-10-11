var earthquakes= new L.LayerGroup();
var tectonic = new L.LayerGroup();

// Adding tile layer
 
var streetmap= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

 // Creating map object
 var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers:[streetmap,earthquakes,tectonic]
});

//Use the link to get the geojon data
var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Perform a Get request to the query URL

d3.json(queryUrl, function(data){
  console.log(data);
  createFeatures(data.features);
});

function createFeatures(earthquakeData){

//Define a function we want to run once for each feature in the features array
//giving each feature a popup describing the magnitude and time of the earhtquake
  function onEachFeature(feature, layer){
    layer.bindPopup(`<h3>${feature.properties.mag}</h3><hr><p>${feature.properties.place} and ${new Date(feature.properties.time)}</p>`);
  
console.log(feature.geometry.coordinates[2]);
  }

  function colorCircle(depth){
    switch(true){
      case depth>30:
        return "green";
      case depth>15:
        return "red";
      case depth>5:
        return "yellow";
      default:
        return "blue";
    }
}

//giving each feature Circle a popup describing the magnitude and time of the earhtquake
function layerCircle(feature, latlng){
  // console.log(feature);
    return new L.CircleMarker(latlng, {
      radius: feature.properties.mag*3, 
      fillOpacity: 0.85,
      color: colorCircle(feature.geometry.coordinates[2])
    }).bindPopup(`<h3>${feature.properties.mag}</h3><hr><p>${feature.properties.place} and ${new Date(feature.properties.time)}</p>`);

} 
  //Create a GeoJson layer containing the features array on the earthquakeData object
  
 L.geoJson(earthquakeData,{
    onEachFeature: onEachFeature,
    pointToLayer: layerCircle
  }).addTo(earthquakes);

  //sending earthquakes layer to the create Map Function
  // createMap(earthquakes);
}

//Tectonice 
var newUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(newUrl, function(data){
  console.log(data);
  
//Create a GeoJson layer containing the features array on the earthquakeData object
L.geoJson(data).addTo(tectonic);
});


//Define a Base Maps object to hold our base layers
var baseMaps = {
  "Street Map":streetmap
};

//Create overlay object to hold our overlay layer
var overlayMaps= {
  Earthquakes: earthquakes,
  Tectonice:tectonic

};


L.control.layers(baseMaps,overlayMaps, {
  collapsed:false
}).addTo(myMap);

