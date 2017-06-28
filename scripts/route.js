var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var directionsMap;
var destination_address, destination_name, destination_phone;

function getDirections(d) {
  destination_address = d.formatted_address;
  destination_name = d.name;
  destination_phone = d.formatted_phone_number;
  
  formatPanel();
  directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsOptions = {
    zoom: 14,
    center: center
  }
  directionsMap = new google.maps.Map(document.getElementById('map'), directionsOptions);
  directionsDisplay.setMap(directionsMap);
  calcRoute();
  return true;
}

function calcRoute() {
  var request = {
    origin: center,
    destination: destination_address,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
  
  //metrics report
  Metrics.report("route request");
}

function formatPanel() {
  var des = "<h4>" + destination_name 
    + "</h4><h5>" + destination_address 
    + "<br /><br />" + destination_phone
    + "</h5><br /><br />";
  var backButton = 
      "<button onclick='initialize()'>Back to Search</button>";
  $("#panel").empty().append(des).append(backButton);
}

function findLocationId(locId) {
  $($("[id=" + locId + "]")).click();
}