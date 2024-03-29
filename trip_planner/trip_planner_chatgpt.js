// Define global variables
let map;
let directionsService;
let directionsRenderer;
let autocomplete;
let travelPriceInfo;
let travelPriceInfoDB;
let travelPriceInfoZC;
let estimatedCost;

// Function to initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.088062, lng: -89.374159 },
        zoom: 16,
    });

    // Geocode the address and place a marker
    var geocoder = new google.maps.Geocoder();
    var address = "1316 East Mifflin St, Madison, WI";

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Get the latitude and longitude
            var location = results[0].geometry.location;

            // Place marker at the coordinates
            var carMarker1 = new google.maps.Marker({
                position: location,
                map: map,
                title: 'Car 1'
            });

            // Add info window that pops up when you scroll over
            var infowindow = new google.maps.InfoWindow({
                content: '<div style="text-align: center;">Car 1</div><br>Address: 1316 East Mifflin St'
            });

            // Show info window when mouseover marker
            carMarker1.addListener('mouseover', function() {
                infowindow.open(map, carMarker1);
            });

            // Hide info window when mouseout marker
            carMarker1.addListener('mouseout', function() {
                infowindow.close();
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: [true,false] // Suppress default markers for start and end points
    });
    directionsRenderer.setMap(map);

    // Initialize Autocomplete for destination input
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("end")
    );

    // Listen for place changes in the destination input
    autocomplete.addListener("place_changed", function () {
        calculateAndDisplayRoute();
    });

    // Listen for changes in the starting location dropdown
    document.getElementById("start").addEventListener("change", function () {
        calculateAndDisplayRoute();
    });

    // Initialize elements for displaying travel price info
    travelPriceInfo = document.getElementById("travelstats");
    travelPriceInfoDB = document.getElementById("travelstatsdb");
    travelPriceInfoZC = document.getElementById("travelstatszc");
    estimatedCost = "";
}

// Execute the initMap function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

// Function to calculate and display the route
function calculateAndDisplayRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const slider = document.getElementById("time_dropdown");

    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                returnCost(response,slider);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}

// Function to calculate and return the travel cost
function returnCost(directionResult,slider) {
    const myRoute = directionResult.routes[0].legs[0];

    const meters_to_mile = 0.000621371;
    const seconds_to_hour = 0.000277778; 

    const cost_per_mile = 0.45;
    const cost_per_hour = 2.0;

    const cost_per_mile_zip = 0.58;
    const cost_per_hour_zip = 14.0;

    const travel_time = (2.0*myRoute.duration.value) * seconds_to_hour;
    const travel_distance = 2.0*myRoute.distance.value * meters_to_mile;
    
    var cost = (parseFloat(slider.value) + travel_time)*cost_per_hour + travel_distance*cost_per_mile;
    var cost_zip = (parseFloat(slider.value) + travel_time)*cost_per_hour_zip + Math.max(travel_distance-180.0, 0.0)*cost_per_mile_zip;

    travelPriceInfoDB.innerHTML = "$" +String(cost.toFixed(2));
    travelPriceInfoZC.innerHTML = "$" +String(cost_zip.toFixed(2));

    document.getElementById("time_dropdown").addEventListener("change", () => {updateCostFromSlider(travel_time, travel_distance, cost_per_hour, cost_per_hour_zip, cost_per_mile, cost_per_mile_zip, slider)});
}

// Function to update the cost when the slider value changes
function updateCostFromSlider(travel_time, travel_distance, cost_per_hour, cost_per_hour_zip, cost_per_mile, cost_per_mile_zip, slider) {
    var cost = (parseFloat(slider.value) + travel_time)*cost_per_hour + travel_distance*cost_per_mile;
    var cost_zip = (parseFloat(slider.value) + travel_time)*cost_per_hour_zip + Math.max(travel_distance-180.0, 0.0)*cost_per_mile_zip;

    travelPriceInfoDB.innerHTML = "$" +String(cost.toFixed(2));
    travelPriceInfoZC.innerHTML = "$" + String(cost_zip.toFixed(2));
}


