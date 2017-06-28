var map, center, infowindow, locationType = [];
var request, service, markers = [], marker_me;
var mapDoc = $("#map");
var detailAddress;

function initialize() {
  builtDropDownLocation();
  
  if (locationType.length == 0) {
    locationType.push(document.forms[0].locations.value);
  }
  
  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation, showError, {timeout:10000});
	}
	else {
		alert("browser not support geolocation");
	} 
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      mapDoc.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      mapDoc.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      mapDoc.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      mapDoc.innerHTML = "An unknown error occurred."
      break;
  }
}

function displayLocation(position) {
  if (!center) {
    center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 14
  });
  
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  
  clearResults();
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

function clearResults() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  $("ul.locations").empty();
}  

function placeMeOnMap() {
  var opt = {
    position: center,
    map: map,
    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    animation: google.maps.Animation.DROP,
    clickable: true    
  };
  marker_me = new google.maps.Marker(opt);
  
  marker_me.addListener('click', function() {
    infowindow.setContent("I'm here.")
    infowindow.open(map, marker_me);
  });  
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
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var request = { reference: place.reference };
  service.getDetails(request, function(details, status) {
    
    if (details != null) {
      
      var marker = new google.maps.Marker( {
        map: map,
        position: place.geometry.location
      });   

      markers.push(marker);

      var $li = $("<li><a>" + details.name + "</a></li>").attr("id", details.id);
      $("ul.locations").append($li);
    
      (function (details) {
        $($("[id=" + details.id + "]")).click(function(){
          getDirections(details);
        });
      }(details));      
     
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("<h5>" + details.name + "</h5>" 
                              + details.formatted_phone_number 
                              + "<br />"
                              + "<a onClick=\"findLocationId(\'" + details.id + "\'" 
                              + ")\">" + "route me" + "</a>"
                             );
        infowindow.open(map, this);        
      });
    }
  });
}     

function userSelectLocation() {
  locationType = [];
  locationType.push(document.forms[0].locations.value);
  google.maps.event.trigger(map, 'rightclick');
  
  //metrics report
  Metrics.report("search: " + locations.value);
}

function builtDropDownLocation() {
  var data = {
    'cafe': 'Cafe',
    'restaurant': 'Restaurant',
    'book_store': 'Book store',
    'atm': 'ATM',
    'cafe': 'Cafe',
    'shopping_mall': 'Shopping mall'
  }

  var s = $("<select id='locations' onchange='userSelectLocation()' />");

  for(var val in data) {
    $('<option />', {value: val, text: data[val]}).appendTo(s);
  }
  f = $("<form />").text("Location: ");
  u = $("<ul class='locations' />")
  s.appendTo(f);
  $("#panel").empty().append(f).append(u);

  if (locationType != "") {
    $("#locations").val(locationType);
  }
}

var Metrics = {};
Metrics.report = function(eventName){
  var event = {event: { name: eventName }};
  var request = new XMLHttpRequest();
  request.open("POST", "https://metrics-tm.herokuapp.com/api/events", true); /* https://metrics-tm.herokuapp.com */
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(event));
};

$(document).ready(function(){
  initialize();
});

