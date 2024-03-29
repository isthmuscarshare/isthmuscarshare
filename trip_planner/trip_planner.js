/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-nocheck TODO remove when fixed



let map;
let markerArray = [];
let circleArray = [];
var stepDisplay;
var statsDisplay;

function initMap() {
  const { Map } = google.maps.importLibrary("maps");
  const bounds = new google.maps.LatLngBounds();
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.089518, lng: -89.370184 },
    zoom: 16,
  });

    // const origin1 = "Tenney Park, Madison, WI";
    // const destination1 = "Sun Prairie, WI";

    // new popupPrices(map, origin1, destination1);

    // const origin3 = "Atwood Ave, Madison, WI";
    // const destination3 = "Fitchburg, WI";

    // new popupPrices(map, origin3, destination3);

    // const origin2 = "Hilldale Mall, Madison, WI";
    // const destination2 = "Pheasant Branch Conservatory, WI";

    //new popupPrices(map, origin2, destination2);

    new toggler(map);

    // new AutocompleteDirectionsHandler(map);

  }

  class toggler {
    map;
    origin;
    destination;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
      this.map = map;
      this.origin = '';
      this.destination = '';
      this.travelMode = google.maps.TravelMode.DRIVING;
      this.directionsService = new google.maps.DirectionsService();
      this.markerArray = []
      
      // Instantiate an info window to hold step text.
      this.stepDisplay = new google.maps.InfoWindow();
  
      // Info window for travel stats (distance, time, etc.)
      this.statsDisplay = new google.maps.InfoWindow();
  
      // Add custom slider for how long the user wants to stay at a destination
      // this.slider = document.getElementById("myRange");
      this.slider = document.getElementById("time_dropdown");
      // this.output = document.getElementById("duration_slider");
      this.output = this.slider;
      this.travelPriceInfo = document.getElementById("travelstats");
      this.travelPriceInfoDB = document.getElementById("travelstatsdb");
      this.travelPriceInfoZC = document.getElementById("travelstatszc");
      this.estimatedCost = "";
  
      // Create a renderer for directions and bind it to the map.
      var rendererOptions = {
        map: map,
        suppressMarkers: false,
        // preserveViewport: true
      }
      this.directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
      this.directionsRenderer.setMap(map);
      // this.manual_route();

      // const onChangeHandler = function () {
      //   // calculateAndDisplayRoute(this.directionsService, this.directionsRenderer);
      //   this.manual_route();
      // };

      this.manual_route();
    
      document.getElementById("start").addEventListener("change", () => {this.manual_route()});
      // document.getElementById("end").addEventListener("change", () => {this.manual_route()});

      // Initialize Autocomplete for destination input
      autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("end"),
        // { types: ["geocode"] } // Specify the type of place data to return
      );

            // Listen for place changes in the destination input
      autocomplete.addEventListener("place_changed", () => {this.manual_route()});

    }

    deleteMarkers(markerArray) {
      for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
    
      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].setMap(null);
      }
    
      markerArray = [];
      circleArray = [];
    }
    manual_route() {
      this.deleteMarkers(markerArray);
      const originInput = document.getElementById("start");
      // TODO: Change end to be a search 
      const destinationInput = document.getElementById("end");
      // const destinationInputAutocomplete = new google.maps.places.Autocomplete(
      //   destinationInput,
      //   { fields: ["place_id", "formatted_address"] },
      // );


      // // Optional: You can add event listeners to handle place selection
      // destinationInputAutocomplete.addListener("place_changed", function () {
      // const place = destinationInputAutocomplete.getPlace();
      // console.log(place); // This will log the selected place object
      

      // const place = destinationInput.getPlace();
      // console.log(place);

      
    
      const slider = document.getElementById("time_dropdown");
      this.directionsService.route(
        {
          origin: originInput.value,
          destination : destinationInput.value,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            console.log(response);
            const me = this;
            me.directionsRenderer.setDirections(response);
            // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
            // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
  
            // Do stuff with the response
            // this.showStats(response,this.markerArray,this.stepDisplay,this.map);
            // this.showSteps(response,this.markerArray,this.stepDisplay,this.map);
            //console.log(slider.value);
            // me.returnCost(response,this.slider,this.output);
            me.returnCost(response,slider,this.output);
            //me.showPrices(response, this.stepDisplay, this.map, this.estimatedCost);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        },
      );
    
    } // end route
    

    //   calculateAndDisplayRoute(directionsService, directionsRenderer) {
    //   directionsService
    //     .route({
    //       origin: {
    //         query: document.getElementById("start").value,
    //       },
    //       destination: {
    //         query: document.getElementById("end").value,
    //       },
    //       travelMode: google.maps.TravelMode.DRIVING,
    //     })
    //     .then((response) => {
    //       directionsRenderer.setDirections(response);
    //       this.returnCost(response,this.slider,this.output);
    //       this.showPrices(response, this.stepDisplay, this.map, this.estimatedCost);
    //     })
    //     .catch((e) => window.alert("Directions request failed due to " + status));
    // }

    // For calculating and showing duration, distance, and cost
    // factoring in input from slider
    returnCost(directionResult,slider,output) {
      //console.log(slider.value);
      // Show distance, time of round-trip travel
      const myRoute = directionResult.routes[0].legs[0];

      const meters_to_mile = 0.000621371;
      const seconds_to_hour = 0.000277778; 

      const cost_per_mile = 0.45;
      const cost_per_hour = 2.0;

      const cost_per_mile_zip = 0.58;
      const cost_per_hour_zip = 14.0;


      // Calculate travel time and distance, multiplying by 2 to make it a round trip
      const travel_time = (2.0*myRoute.duration.value) * seconds_to_hour;
      const travel_distance = 2.0*myRoute.distance.value * meters_to_mile;

      // Calculate cost as minimum of time and distance-based estimate, adding an hour for shopping, etc.
      // var cost = Math.min((slider.value/60.0 + travel_time)*cost_per_hour, travel_distance*cost_per_mile);
      // var cost_zip = Math.min((slider.value/60.0 + travel_time)*cost_per_hour_zip, travel_distance*cost_per_mile_zip);
      
      var cost = (parseFloat(slider.value) + travel_time)*cost_per_hour + travel_distance*cost_per_mile;
      var cost_zip = (parseFloat(slider.value) + travel_time)*cost_per_hour_zip + Math.max(travel_distance-180.0, 0.0)*cost_per_mile_zip;

      // output.innerHTML = slider.value;

      this.estimatedCost = "Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      + "ZipCar: $" + String(cost_zip.toFixed(2));

      this.travelPriceInfo.innerHTML = "Factoring in a travel time of " + String(travel_time.toFixed(2)) + " hours" + "<br>" 
        + "and driving distance of " + String(travel_distance.toFixed(2)) + " miles..." + "<br>";
        // + "<br>"
        // + "Cost with Down the Block: $" + String(cost.toFixed(2)) + "<br>"
        // + "Cost with ZipCar: $" + String(cost_zip.toFixed(2));
      this.travelPriceInfoDB.innerHTML = "$" +String(cost.toFixed(2));

      this.travelPriceInfoZC.innerHTML = "$" +String(cost_zip.toFixed(2));

      // document.getElementById("myRange").addEventListener("input", () => {this.update_cost_from_slider(travel_time, travel_distance, cost_per_hour, cost_per_hour_zip, cost_per_mile, cost_per_mile_zip, slider)});
      document.getElementById("time_dropdown").addEventListener("change", () => {this.updateCostFromSlider(travel_time, travel_distance, cost_per_hour, cost_per_hour_zip, cost_per_mile, cost_per_mile_zip, slider)});
      
    }

    updateCostFromSlider(travel_time, travel_distance, cost_per_hour, cost_per_hour_zip, cost_per_mile, cost_per_mile_zip, slider) {
      // print value below slider
      //output.innerHTML = this.value;
      var cost = (parseFloat(slider.value) + travel_time)*cost_per_hour + travel_distance*cost_per_mile;
      var cost_zip = (parseFloat(slider.value) + travel_time)*cost_per_hour_zip + Math.max(travel_distance-180.0, 0.0)*cost_per_mile_zip;

      this.estimatedCost = "Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      + "ZipCar: $" + String(cost_zip.toFixed(2));

      // this.travelPriceInfo.innerHTML = "Factoring in a travel time of " + String(travel_time.toFixed(2)) + " hours" + "<br>" 
      //   + "and driving distance of " + String(travel_distance.toFixed(2)) + " miles..." + "<br>"
      //   + "<br>"
      //   + "Cost with Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      //   + "Cost with ZipCar: $" + String(cost_zip.toFixed(2));

      this.travelPriceInfo.innerHTML = "Factoring in a travel time of " + String(travel_time.toFixed(2)) + " hours" + "<br>" 
      + "and driving distance of " + String(travel_distance.toFixed(2)) + " miles..." + "<br>";
      // + "<br>"
      // + "Cost with Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      // + "Cost with ZipCar: $" + String(cost_zip.toFixed(2));
      this.travelPriceInfoDB.innerHTML = "$" +String(cost.toFixed(2));

      this.travelPriceInfoZC.innerHTML = "$" + String(cost_zip.toFixed(2));

      // this.output.innerHTML = slider.value;
      }

    // For annotating prices of route including wait time determined by slider
    showPrices(directionResult, stepDisplay, map, estimatedCost) {
      // For each step, place a marker, and add the text to the marker's infowindow.
      // Also attach the marker to an array so we can keep track of it and remove it
      // when calculating new routes.
      const myRoute = directionResult.routes[0].legs[0];
    
      //price_text = returnCost(directionResult,slider,output);
      
      // TODO -- make this larger and more readable
      // const marker = new google.maps.Marker();
      const marker = new google.maps.Marker();
    
      marker.setMap(map);
      marker.setPosition(myRoute.steps[myRoute.steps.length-1].end_location);
      const circle = new google.maps.Circle({
        strokeColor: "#3cff00",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#3cff00",
        fillOpacity: 0.35,
        map,
        center: myRoute.steps[0].start_location,
        radius: 800.0,
      });
      circleArray.push(circle);
      this.attachCarsharePrices(
        stepDisplay,
        marker,
        //"Cost goes here",
        estimatedCost,
        map,
      );

      markerArray.push(marker);
  
    }
  
    
  
    attachCarsharePrices(stepDisplay, marker, text, map) {
      // TODO -- make this show up only if you hover over the route? Definitely not a click
      // google.maps.event.addListener(marker, "mouseover", () => {
      //   // Open an info window when the marker is clicked on, containing the text
      //   // of the step.
      //   stepDisplay.setContent(text);
      //   stepDisplay.open(map, marker);
      // });
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    }


  }

  // Show prices on markers functionality
// -----------------------------------------------------//
class popupPrices {
  map;
  origin;
  destination;
  travelMode;
  directionsService;
  directionsRenderer;
  constructor(map,origin,destination) {
    this.map = map;
    this.origin = origin;
    this.destination = destination;
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.markerArray = []
    
    // Instantiate an info window to hold step text.
    this.stepDisplay = new google.maps.InfoWindow();

    // Info window for travel stats (distance, time, etc.)
    this.statsDisplay = new google.maps.InfoWindow();

    // Add custom slider for how long the user wants to stay at a destination
    //this.slider = document.getElementById("myRange");
    //this.output = document.getElementById("duration_slider");
    // this.estimatedCost = document.getElementById("travelstats");
    this.estimatedCost = "";

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map,
      suppressMarkers: true,
      preserveViewport: true
    }
    this.directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    this.directionsRenderer.setMap(map);

    const originInput = [this.origin];
    const destinationInput = [this.destination];

    // Loop over origin-destination pairs
    for (let i = 0; i < originInput.length; i++) {

      this.origin = originInput[i];
      this.destination = destinationInput[i];
      this.manual_route();
    } // end for loop
  } // end constructor

  manual_route() {

    this.directionsService.route(
      {
        origin: this.origin,
        destination: this.destination,
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === "OK") {
          console.log(response);
          const me = this;
          me.directionsRenderer.setDirections(response);

          // Do stuff with the response
          // this.showStats(response,this.markerArray,this.stepDisplay,this.map);
          // this.showSteps(response,this.markerArray,this.stepDisplay,this.map);

          this.returnCost(response,this.slider,this.output);
          this.showPrices(response, this.stepDisplay, this.map, this.estimatedCost);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      },
    );
  
  } // end route


  // For calculating and showing duration, distance, and cost
  // factoring in input from slider
  returnCost(directionResult,slider,output) {
    // Show distance, time of round-trip travel
    const myRoute = directionResult.routes[0].legs[0];

    const meters_to_mile = 0.000621371;
    const seconds_to_hour = 0.000277778; 

    const cost_per_mile = 1.5;
    const cost_per_hour = 3.0;

    const cost_per_mile_zip = 2.5;
    const cost_per_hour_zip = 12.0;


    // Calculate travel time and distance, multiplying by 2 to make it a round trip
    const travel_time = (2.0*myRoute.duration.value) * seconds_to_hour;
    const travel_distance = 2.0*myRoute.distance.value * meters_to_mile;

    // Calculate cost as minimum of time and distance-based estimate, adding an hour for shopping, etc.
    // var cost = Math.min((slider.value/60.0 + travel_time)*cost_per_hour, travel_distance*cost_per_mile);
    // var cost_zip = Math.min((slider.value/60.0 + travel_time)*cost_per_hour_zip, travel_distance*cost_per_mile_zip);

    var cost = Math.min((60.0/60.0 + travel_time)*cost_per_hour, travel_distance*cost_per_mile);
    var cost_zip = Math.min((60.0/60.0 + travel_time)*cost_per_hour_zip, travel_distance*cost_per_mile_zip);


    this.estimatedCost = "Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      + "ZipCar: $" + String(cost_zip.toFixed(2));
  
  }

  


  // For annotating steps of route
  showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    const myRoute = directionResult.routes[0].legs[0];
  
    for (let i = 0; i < myRoute.steps.length; i++) {
      const marker = (markerArray[i] =
        markerArray[i] || new google.maps.Marker());
  
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
        stepDisplay,
        marker,
        myRoute.steps[i].instructions,
        map,
      );
    }
  }
  
  attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, "click", () => {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

  // For annotating prices of route including wait time determined by slider
  showPrices(directionResult, stepDisplay, map, estimatedCost) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    const myRoute = directionResult.routes[0].legs[0];
  
    //price_text = returnCost(directionResult,slider,output);
    
    // TODO -- make this larger and more readable
    // const marker = new google.maps.Marker();
    const marker = new google.maps.Marker();
  
      marker.setMap(map);
      marker.setPosition(myRoute.steps[myRoute.steps.length-1].end_location);
      this.attachCarsharePrices(
        stepDisplay,
        marker,
        //"Cost goes here",
        estimatedCost,
        map,
      );

      markerArray.push(marker);

    }

  

  attachCarsharePrices(stepDisplay, marker, text, map) {
    // TODO -- make this show up only if you hover over the route? Definitely not a click
    // google.maps.event.addListener(marker, "mouseover", () => {
    //   // Open an info window when the marker is clicked on, containing the text
    //   // of the step.
    //   stepDisplay.setContent(text);
    //   stepDisplay.open(map, marker);
    // });
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  }

}



class AutocompleteDirectionsHandler {
  map;
  originPlaceId;
  destinationPlaceId;
  travelMode;
  directionsService;
  directionsRenderer;
  constructor(map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    
    // Instantiate an info window to hold step text.
    this.stepDisplay = new google.maps.InfoWindow();

    // Info window for travel stats (distance, time, etc.)
    this.statsDisplay = new google.maps.InfoWindow();

    this.estimatedCost = "";

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map,
      suppressMarkers: true
    }
    this.directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    // const modeSelector = document.getElementById("mode-selector");
    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["place_id"] },
    );
    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["place_id"] },
    );

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      destinationInput,
    );
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }

    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
  
        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }
  
        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }
  
        this.route();
      });
    }
    route() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
  
      // Delete existing markers
      deleteMarkers(markerArray);

      const me = this;
  
      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);

            // Do stuff with the response
            // this.showStats(response,this.markerArray,this.stepDisplay,this.map);
            // this.showSteps(response,this.markerArray,this.stepDisplay,this.map);
            this.returnCost(response,this.slider,this.output);
            this.showPrices(response, this.stepDisplay, this.map, this.estimatedCost);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        },
      );
    }

    
  
  // For calculating and showing duration, distance, and cost
  // factoring in input from slider
  returnCost(directionResult,slider,output) {
    // Show distance, time of round-trip travel
    const myRoute = directionResult.routes[0].legs[0];

    const meters_to_mile = 0.000621371;
    const seconds_to_hour = 0.000277778; 

    const cost_per_mile = 1.5;
    const cost_per_hour = 3.0;

    const cost_per_mile_zip = 2.5;
    const cost_per_hour_zip = 12.0;


    // Calculate travel time and distance, multiplying by 2 to make it a round trip
    const travel_time = (2.0*myRoute.duration.value) * seconds_to_hour;
    const travel_distance = 2.0*myRoute.distance.value * meters_to_mile;

    // Calculate cost as minimum of time and distance-based estimate, adding an hour for shopping, etc.
    // var cost = Math.min((slider.value/60.0 + travel_time)*cost_per_hour, travel_distance*cost_per_mile);
    // var cost_zip = Math.min((slider.value/60.0 + travel_time)*cost_per_hour_zip, travel_distance*cost_per_mile_zip);

    var cost = Math.min((60.0/60.0 + travel_time)*cost_per_hour, travel_distance*cost_per_mile);
    var cost_zip = Math.min((60.0/60.0 + travel_time)*cost_per_hour_zip, travel_distance*cost_per_mile_zip);


    // const contentString =
    // '<div id="content">' +
    // '<div id="siteNotice">' +
    // "</div>" +
    // '<h1 id="firstHeading" class="firstHeading">Devils Lake State Park</h1>' +
    // '<h1 id="secondHeading" class="secondHeading">Carshare Price Estimates</h1>' +
    // '<div id="bodyContent">' +
    // "<p><b>Down the Block: $" + String(cost.toFixed(2)) + "</b>, </p>" +
    // "<p><b>ZipCar: $" + String(cost_zip.toFixed(2)) + "</b>, </p>"
    // "</div>" +
    // "</div>";

    this.estimatedCost = "Down the Block: $" + String(cost.toFixed(2)) + "<br>"
      + "ZipCar: $" + String(cost_zip.toFixed(2));

      // const infowindow = new google.maps.InfoWindow({
      //   content: this.estimatedCost,
      //   ariaLabel: "Uluru",
      // });
      // const marker = new google.maps.Marker({
      //   position: myRoute.steps[-2].start_location,
      //   map,
      //   title: "Destination",
      // });
    
      // marker.addListener("click", () => {
      //   infowindow.open({
      //     anchor: marker,
      //     map,
      //   });
      // });
  
  }


  deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
  
    markersArray = [];
  }

      // For annotating prices of route including wait time determined by slider
  showPrices(directionResult, stepDisplay, map, estimatedCost) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    const myRoute = directionResult.routes[0].legs[0];
  
    const marker = new google.maps.Marker();
  
      marker.setMap(map);
      marker.setPosition(myRoute.steps[myRoute.steps.length-1].end_location);
      this.attachCarsharePrices(
        stepDisplay,
        marker,
        estimatedCost,
        map,
      );
    }
  

  attachCarsharePrices(stepDisplay, marker, text, map) {
    // TODO -- make this show up only if you hover over the route? Definitely not a click
    // google.maps.event.addListener(marker, "mouseover", () => {
    //   // Open an info window when the marker is clicked on, containing the text
    //   // of the step.
    //   stepDisplay.setContent(text);
    //   stepDisplay.open(map, marker);
    // });
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  }
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}

window.initMap = initMap;


