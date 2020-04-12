var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = { lat: 34.06338, lng: -118.35808 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 4,
    mapTypeId: "roadmap",
    styles:[
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow();

  displayStore(stores);
  showStoresMarkers(stores);
  setOnClickListener(stores);

}

function searchStores(){
  var zipCode = document.getElementById('zip-code-input').value;

  let foundStore = [];

  if(zipCode) {
    for(var store of stores){
      var postal = store.address.postalCode.substring(0, 5);
      if(postal == zipCode){
        foundStore.push(store);
      }
    }
  } else {
    foundStore = stores;
  }

  clearLocations();
  displayStore(foundStore);
  showStoresMarkers(foundStore);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  markers.forEach(function(marker){
      marker.setMap(null);
  });

  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll('.store-container');

  storeElements.forEach(function(elem, index){
    elem.addEventListener('click', function() {
      new google.maps.event.trigger(markers[index], 'click');
    });
  });
}

function displayStore(stores) {
  var storesHtml = "";
  stores.forEach(function (store, index) {
    let address = store.addressLines;
    let phone = store.phoneNumber;
    storesHtml += `
    <div class="store-container">
      <div class="store-container-background">
        <div class="store-info-container">
          <div class="store-address">
              <span class="street">${address[0]}<span>
              <span class="city">${address[1]}</span>
          </div>
          <div class="store-phone-number">
            ${phone}
          </div>
        </div>
        <div class="store-number-container">
          <div class="store-number">${index + 1}</div>
        </div>
      </div>
    </div>
    `;

    document.querySelector(".store-list").innerHTML = storesHtml;
  });
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name;
    var address = store.addressLines[0];
    var openStatus = store.openStatusText;
    var phoneNumber = store.phoneNumber;
    var originText = encodeURI("San Fransisco"); // set the origin is san fransisco

    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatus, phoneNumber, originText);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatus, phoneNumber, originText) {
  var destination = encodeURI(address);
  var gmapDirectionLuink = `https://www.google.com/maps/dir/?api=1&origin=${originText}&destination=${destination}`;
  var html = `
    <div class="mapInfo">
      <div class="name">${name}</div>
      <div class="open-status">${openStatus}</div>
      <div class="address">
        <div class="circle">
          <i class="fas fa-location-arrow"></i>
        </div>
        <a href="${gmapDirectionLuink}" target="_blank">${address}</a>
      </div>
      <div class="phone-number">
        <div class="circle">
          <i class="fas fa-phone"></i>
        </div>
        ${phoneNumber}
      </div>
    </div>
  `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: 'images/coffee/32x32.png'
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
