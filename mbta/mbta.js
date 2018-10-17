function init()
{
	// set the South station as the landmark
	var landmark = new google.maps.LatLng(42.352035, -71.055182);
			
	// Set up map
	var myOptions = {
		zoom: 13, 
		center: landmark,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
				
	// Create the map
	var themap = new google.maps.Map(document.getElementById("map"), myOptions);
	
	// Create a marker				
	var marker = new google.maps.Marker({
		position: landmark,
		title: "South Station, Boston, MA"
		});
	marker.setMap(themap);
				
	// Create a global info window that opens onclick
	var infowindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(themap, marker);
		});
}