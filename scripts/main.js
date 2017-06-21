function displayMap() {
	var lat = 32.715736;
	var lng = -117.161087;
  
  var center = new google.maps.LatLng(lat, lng);
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 12
  }); 
}

google.maps.event.addDomListener(window, 'load', displayMap);

$(document).ready(function(){
  
});
