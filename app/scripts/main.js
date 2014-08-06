var map, meMarker, timumMarker, meLocation, timumLocation;
      function init_map() {
        timumLocation = new google.maps.LatLng(42.524999,13.399107);
 
        var map_options = {
          zoom: 17
        };
 
 
        map = new google.maps.Map(document.getElementById("map-container"),
            map_options);
        timumMarker = new google.maps.Marker({
            position: timumLocation,
            map: map,
            title:"timum"});
	   if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      var meLocation = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	      var infowindow = new google.maps.InfoWindow({
	        map: map,
	        position: meLocation,
	        content: 'Location found using HTML5.'
	      });
	        meMarker = new google.maps.Marker({
	            position: meLocation,
	            map: map,
	            title:"You are here"});

	      map.setCenter(meLocation);
	      // map.panTo(meLocation);
	    }, function() {
	      handleNoGeolocation(true);
	    });
	  }  else {
	    // no native support; maybe try a fallback?
	      handleNoGeolocation(false);
	  }
      }
 
google.maps.event.addDomListener(window, 'load', init_map);