station = [
	{
		name:"Alewife",
		lat:42.395428,
		lon:-71.142483,
		id:"place-alfcl"
	},{
		name:"Davis",
		lat:42.39674,
		lon:-71.121815,
		id:"place-davis"
	},{
		name:"Porter Square",
		lat:42.3884,
		lon:-71.11914899999999,
		id:"place-portr"
	},{
		name:"Harvard Square",
		lat:42.373362,
		lon:-71.118956,
		id:"place-harsq"
	},{
		name:"Central Square",
		lat:42.365486,
		lon:-71.103802,
		id:"place-cntsq"
	},{
		name:"Kendall/MIT",
		lat:42.36249079,
		lon:-71.08617653,
		id:"place-knncl"
	},{
		name:"Charles/MGH",
		lat:42.361166,
		lon:-71.070628,
		id:"place-chmnl"
	},{
		name:"Park Street",
		lat:42.3563945,
		lon:-71.0624242,
		id:"place-pktrm"
	},{
		name:"Downtown Crossing",
		lat:42.355518,
		lon:-71.060225,
		id:"place-dwnxg"
	},{
		name:"South Station",
		lat:42.352271,
		lon:-71.05524200000001,
		id:"place-sstat"
	},{
		name:"Broadway",
		lat:42.342622,
		lon:-71.056967,
		id:"place-brdwy"
	},{
		name:"Andrew",
		lat:42.330154,
		lon:-71.057655,
		id:"place-andrw"
	},{
		name:"JFK/UMass",
		lat:42.320685,
		lon:-71.052391,
		id:"place-jfk"
	},{
		name:"North Quincy",
		lat:42.275275,
		lon:-71.029583,
		id:"place-nqncy"
	},{
		name:"Wollaston",
		lat:42.2665139,
		lon:-71.0203369,
		id:"place-wlsta"
	},{
		name:"Quincy Center",
		lat:42.251809,
		lon:-71.005409,
		id:"place-qnctr"
	},{
		name:"Quincy Adams",
		lat:42.233391,
		lon:-71.007153,
		id:"place-qamnl"
	},{
		name:"Braintree",
		lat:42.2078543,
		lon:-71.0011385,
		id:"place-brntn"
	},{
		name:"Savin Hill",
		lat:42.31129,
		lon:-71.053331,
		id:"place-shmnl"
	},{
		name:"Fields Corner",
		lat:42.300093,
		lon:-71.061667,
		id:"place-fldcr"
	},{
		name:"Shawmut",
		lat:42.29312583,
		lon:-71.06573796000001,
		id:"place-smmnl"
	},{
		name:"Ashmont",
		lat:42.284652,
		lon:-71.06448899999999,
		id:"place-asmnl"
	}
];

function initMap()
{		
	// Set up the map	

	landmark = new google.maps.LatLng(42.352271, -71.05524200000001);
			
	myOptions = {
		zoom: 13, 
		center: landmark,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	themap = new google.maps.Map(document.getElementById("map"), myOptions);


	//show all the stations on the map
	displaystations();

	//draw the polylines that connect each station
	drawline();

	//display the user's location on the map
	//center the map at user's location
	//find the closest station
	mylocation();

}

function displaystations()
{

	slat = new Array();
	slon = new Array();
	sid = new Array();
	newwindow = new google.maps.InfoWindow();

	message = "";
	
	for (var i = 0; i < station.length; i++)
	{
		slat.push(station[i].lat);
		slon.push(station[i].lon);
		sid.push(station[i].id);

		var newmark = new google.maps.LatLng(slat[i], slon[i]);
		var newmarker = new google.maps.Marker({
			position: newmark,
			title: message,		
			icon:{
			url: "metro.png",
			scaledSize: new google.maps.Size(25, 25)
			}},	
		);
	
		newmarker.setMap(themap);

		google.maps.event.addListener(newmarker, 'click', function(newmarker, i) {
			return function(){
			getschedule(i);
			newwindow.open(themap, newmarker);
			}
		}(newmarker,i));

	}
}

//return the schedule for the station 
function getschedule(i)
{
	request = new XMLHttpRequest();
	request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + sid[i], true);

	tonorth = "The upcoming trains to Alewife: " + "<ul>";
	tosouth = "The upcoming trains to Ashmont/Braintree: " + "<ul>";
	basic = "<h4>" + station[i].name + " Boston, MA" + "</h4>" + "\n";

	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200)
		{
			thedata = request.responseText;
			schedule = JSON.parse(thedata);
			ncount = 0;
			scount = 0;
			console.log(schedule.data.length);
			for(i = 0; i < schedule.data.length; i++)
			{
				//if the train is going northbound
				if(schedule.data[i].attributes.direction_id == 1){
					if(schedule.data[i].attributes.arrival_time != null)
					{
						tonorth += "<li>" + schedule.data[i].attributes.arrival_time;
						ncount++;
					}
				}

				//if the train is going southbound
				else{
						if(schedule.data[i].attributes.arrival_time != null)
						{
							tosouth += "<li>" + schedule.data[i].attributes.arrival_time;
							scount++;
						}

				}

			}

		
			if(ncount == 0)
				{
					tonorth += "No upcoming train available."
				}

			if(scount == 0)
				{
					tosouth += "No upcoming train available."
				}	
				

			message = basic + tonorth + "</ul>" + tosouth + "</ul>";
			
			newwindow.setContent(message);		
		}

		else if(request.status != 200)
		{
			alert("Unable to load the schedule.");
		}
	}

	request.send();

}

function drawline()
{
	for (var i = 0; i < station.length - 1; i++)
	{	
		var j = i + 1;
		var coordinates = [
		{lat: slat[i], lng: slon[i]}, 
		{lat: slat[j], lng: slon[j]}
		];	

		var theline = new google.maps.Polyline({
			path: coordinates,
			strokeColor: '#000000',
			strokeOpacity: 1.0,
          	strokeWeight: 2
		});

		if(station[j].name != "Savin Hill" && station[i].name != "Braintree")
		{
			theline.setMap(themap);
		}

	}

	//connects JFK and Sanvin Hill
	var addition = [
		{lat: slat[12], lng: slon[12]}, 
		{lat: slat[18], lng: slon[18]}
	];	

	var addline = new google.maps.Polyline({
		path: addition,
		strokeColor: '#000000',
		strokeOpacity: 1.0,
        strokeWeight: 2
	});

	addline.setMap(themap);
}


//get the location of user
function mylocation()
{
	if (navigator.geolocation) 
	{ 
		navigator.geolocation.getCurrentPosition(function(position) {
			mylat = position.coords.latitude;
			mylon = position.coords.longitude;

			//update the map according to my location
			updatemap();
		});
	}
	else 
	{
		alert("Your web browser does not support geolocation.");
	}

}

function updatemap()
{
	myloc = new google.maps.LatLng(mylat, mylon);
	themap.panTo(myloc);

	//calulate the distance between user and the closest station
	getclosest();

	mymarker = new google.maps.Marker({
		position: myloc,
		title: "The closest station, " + closeststation + ", is approximately " + min + " miles from you."
		});

	mymarker.setMap(themap);

	google.maps.event.addListener(mymarker, 'click', function() {
				newwindow.setContent(mymarker.title);
				newwindow.open(themap, mymarker);
	});
}


function getclosest()
{
	stationloc = new google.maps.LatLng(slat[0], slon[0]);
	min = google.maps.geometry.spherical.computeDistanceBetween(myloc, stationloc);

	for (var i = 1; i < station.length; i++)
	{
		stationloc = new google.maps.LatLng(slat[i], slon[i]);
		newdis = google.maps.geometry.spherical.computeDistanceBetween(myloc, stationloc);
		if (newdis < min)
		{
			min = newdis;
			closeststation = station[i].name;
			cslat = slat[i];
			cslon = slon[i];
		}
	}

	//meter-to-mile conversion
	min *= 0.000621371;
	min = min.toFixed(2);

	var mystation = [
		{lat: mylat, lng: mylon}, 
		{lat: cslat, lng: cslon}
	];	

	var myline = new google.maps.Polyline({
		path: mystation,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
        strokeWeight: 2
	});

	myline.setMap(themap);
}	



