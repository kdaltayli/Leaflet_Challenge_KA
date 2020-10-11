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
    var earthquakes= L.geoJson(earthquakeData,{
      onEachFeature: onEachFeature,
      pointToLayer: layerCircle
    });

    //sending earthquakes layer to the create Map Function
    createMap(earthquakes);
  }

  function createMap(earthquakes){

   // Adding tile layer
   var streetmap= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

  //Define a Base Maps object to hold our base layers
  var baseMaps = {
    "Street Map":streetmap,
    "Open Map": OpenTopoMap,
    "Dark Map": dark
  };

  //Create overlay object to hold our overlay layer
  var overlayMaps= {
    Earthquakes: earthquakes
  };

   // Creating map object
   var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
    layers:[streetmap,earthquakes]
  });

  L.control.layers(baseMaps,overlayMaps, {
    collapsed:false
  }).addTo(myMap);
}
