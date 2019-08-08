const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, d => {
  buildData(d.features);
});

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var buildData = (data) => {
  let circles = L.geoJSON(data, {
    onEachFeature: labels,
    pointToLayer: (d, loc) => {
      return new L.circle(loc,
        {
          radius: (d.properties.mag * 20000),
          fillColor: getColor(d.properties.mag),
          fillOpacity: .5,
          color: getColor(d.properties.mag),
          stroke: true,
          weight: .5
        })
    }
  });
  buildMap(circles);
};

var buildMap = circles => {
    myMap = L.map("map", {
    center: [10, 0],
    zoom: 3,
    layers: [streetmap, circles]
});return circles.myMap};

var getColor = d => {
  if (d >= 6 ){
    color = '#FF0000'
  } else if (d >= 5) {
    color = '#FF5f5f'
  } else if (d >= 4) {
    color = '#ff925f'
  } else if (d >= 3) {
    color = '#ffd45f'
  } else if (d >= 2) {
    color = '#dcff5f'
  } else if (d >= 1) {
    color = '#dbf091'
  } else {
    color = '#FFFFFF'
  } return color
};

var labels = (d, layer) => {
  layer.bindPopup("<b>" + "Location:" + "</b>" + "<br>" + d.properties.place +
    "</p><p>" + "<b>" + "Time:" + "</b>" + "<br>" + new Date(d.properties.time) + "</p>"
    + "<b><p>" + "Magnitude:" + "<br></b>" + d.properties.mag);
}

var buildMap = circles => {
  myMap = L.map("map", {
  center: [10, 0],
  zoom: 3,
  layers: [streetmap, circles]
}); 

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 4, 5],
        labels = [];

        for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap)};