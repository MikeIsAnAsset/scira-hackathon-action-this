import * as State from './store';

var store;
class Store{
    constructor(state){
        this.state = Object.assign({}, state);
        this.listeners = [];
    }

    addStateListener(listener){
        this.listeners.push(listener);
    }

    dispatch(reducer){
        this.state = reducer(this.state);

        this.listeners.forEach((listener) => listener());
    }

    getState(){
        return this.state;
    }
}



store = new Store(State);

document.body.onload = addElement();

function addElement(){ 
    // create a new div element 
    // debugger;
    var newDiv = document.createElement("div"); 
    newDiv.className = "navbar navbar-default";
    // and give it some content 
    var newContent = document.createTextNode("action this!"); 
    // add the text node to the newly created div
    newDiv.appendChild(newContent);  
  
    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById('map'); 
    
    currentDiv.insertAdjacentElement('beforebegin', newDiv);
}   
   



  
    var map = L.map('map')
    .setView([38.631151, -90.193245], 11);

  // Create a tile layer and add it to the map.
  // See how to use these map tiles, and other map tiles at:
  //   - https://leaflet-extras.github.io/leaflet-providers/preview
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
  }).addTo(map);

  
// Get the Locations from the SensorThings server
axios.get('https://stlouis18-03341.sensorup.com/v1.0/FeaturesOfInterest').then(function(success) {


// debugger;
  // Convert the Locations into GeoJSON Features
  var geoJsonFeatures = success.data.value.map(function(location) {
    return {
      type: 'Feature',
      geometry: location.feature
    };
  });

  // Create a GeoJSON layer, and add it to the map
  var geoJsonLayerGroup = L.geoJSON(geoJsonFeatures);
  geoJsonLayerGroup.addTo(map);

  // Zoom in the map so that it fits the Locations
  map.fitBounds(geoJsonLayerGroup.getBounds());
});

var rdata = document.querySelector(".card-deck");
axios
    .get('https://stlouis18-03341.sensorup.com/v1.0/Observations')
    .then(function(success) {
        // debugger;
        var state = store.getState();
        state.locale = success.data.value;
        
        rdata.innerHTML = state.locale.map(function(response){
            // debugger;
            if(response.result.toLowerCase() == 'fire'){
                return `

                <div class="card" style="width: 286px;">
                    <img class="card-img-top" src="http://www.frcmedianews.org/wp-content/uploads/2017/07/Fire-Standard.jpg" alt="Card image cap" style="width: 286px;">
                    <div class="card-body" >
                        <h3 class="card-title">${response.result}</h3>
                        <p class="card-text">${Date(response.phenomenonTime)}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
                `; 
            } else if(response.result.toLowerCase() == 'accident'){
                return `

                <div class="card" style="width: 286px;">
                    <img class="card-img-top" src="https://robertdebry.com/wp-content/uploads/2017/07/Car-Accident.jpg" alt="Card image cap" style="width: 286px;">
                    <div class="card-body" >
                        <h3 class="card-title">${response.result}</h3>
                        <p class="card-text">${Date(response.phenomenonTime)}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
                `;                 
            }

        });
    });





    