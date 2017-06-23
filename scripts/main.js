var map, center, infowindow, locationType = [];
var request, service, markers = [], marker_me;

function initialize() {
  locationType.push("restaurant");
  
  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation, errorCallback, {timeout:10000});
	}
	else {
		alert("no geolocation!");
	} 
}

function errorCallback() {
  console.log("geolocation error call");
}

function displayLocation(position) {
  center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 14
  });
  
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  
  placeMeOnMap();
  placeSearchResultOnMap();

  google.maps.event.addListener(map, "rightclick", function(event) {
    if (marker_me) {
      marker_me.setMap(null);
    }
    
    if (event != undefined) {
      center = event.latLng;
    }
    map.setCenter(center);
    clearResults();
    
    placeMeOnMap();
    placeSearchResultOnMap();
  });        
}

function placeMeOnMap() {
  var opt = {
    position: center,
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    animation: google.maps.Animation.DROP,
    clickable: true    
  }
  marker_me = new google.maps.Marker(opt);
}

function placeSearchResultOnMap() {
  request = {
    location: center,
    radius: 2000, 
    types: locationType 
  };
  service.nearbySearch(request, callback); 
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i=0; i<results.length; i++) {
      markers.push(createMarker(results[i]));
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
    marker = new google.maps.Marker( {
    map: map,
    position: place.geometry.location
  });   

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    alert(marker.getPosition());
  });

  return marker;      
}     

function clearResults() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}  

google.maps.event.addDomListener(window, 'load', initialize);

window.onload = function() {
  
};

