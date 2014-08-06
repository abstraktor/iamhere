var map, meMarker, meLocation, otherMarkers = {}, client, clients;

// var nearTimum = 52.525382, 13.398231;
      function init_map() {
        // timumLocation = new google.maps.LatLng(52.524999,13.399107);
 
        var map_options = {
          zoom: 17
        };
 
 
        map = new google.maps.Map(document.getElementById("map-container"),
            map_options);
        // timumMarker = new google.maps.Marker({
        //     position: timumLocation,
        //     map: map,
        //     title:"timum"});
	   if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      meLocation = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	      var infowindow = new google.maps.InfoWindow({
	        map: map,
	        position: meLocation,
	        content: "You're at ("+position.coords.latitude+","+position.coords.longitude+")"
	      });
	        meMarker = new google.maps.Marker({
	            position: meLocation,
	            map: map,
	            title:"You are here"});

	      map.setCenter(meLocation);
	      // map.panTo(meLocation);

	      initFire();
	    }, function() {
	      handleNoGeolocation(true);
	    });
	  }  else {
	    // no native support; maybe try a fallback?
	      handleNoGeolocation(false);
	  }
      }
 
google.maps.event.addDomListener(window, 'load', init_map);

//###################################################################################
function initFire(){
	clients = new Firebase("https://dazzling-fire-7219.firebaseio.com/clients");
	if(localStorage.getItem("clientId")){
		client = clients.child(localStorage.getItem("clientId"));
			console.log("my restored is", client.name());
			initGeo();
	}else{
		client = clients.push("", function(){
			localStorage.setItem("clientId", client.name());
			console.log("my just created id is", client.name());
			initGeo();
		});
	}
}


function initGeo(){
	var firebaseRef = new Firebase("https://dazzling-fire-7219.firebaseio.com/locations");

	var meLocPair = [meLocation.lat(), meLocation.lng()];

	// Create a GeoFire index
	var geoFire = new GeoFire(firebaseRef);
	geoFire.set(client.name(), meLocPair).then(function() {
	  console.log("Provided key "+cliendId+" has been added to GeoFire at ["+meLocPair[0]+","+meLocPair[1]+"]");
	}, function(error) {
	  console.log("Error: " + error);
	});

	//fetch
	var geoQuery = geoFire.query({
	  center: meLocPair,
	  radius: 10.5
	});

	geoQuery.on('key_entered', function(key, locPair, distance){
		console.log('key_entered', key, locPair);
	    otherMarkers[key] = new google.maps.Marker({
		    position: new google.maps.LatLng(locPair[0], locPair[1]), //location?
		    map: map,
		    title: distance +"km"});
	});

	geoQuery.on('key_exited', function(key, locPair, distance){
		console.log('key_exited', key, locPair);
	    if(otherMarkers[key])
	    	otherMarkers[key].setMap(null);
	    delete otherMarkers[key];
	});

	geoQuery.on('key_moved', function(key, locPair, distance){
		console.log('key_moved', key, locPair);
	    otherMarkers[key].setPosition(new google.maps.LatLng(locPair[0], locPair[1]));
	    otherMarkers[key].setTitle(distance+"km");
	});
}