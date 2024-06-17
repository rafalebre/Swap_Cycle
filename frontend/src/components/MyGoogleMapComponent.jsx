import React, { useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: '30vw',
  height: '30vh'
};

function MyGoogleMapComponent() {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);  // Ref para o input do autocomplete

  useEffect(() => {
    const initializeMap = () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"]  // Essencial para usar o Places API para autocomplete
      });

      loader.load().then(() => {
        if (mapRef.current) {
          const google = window.google;
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 10,
          });

          // Geolocation to center the map at the user's current position
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(currentLocation);
            }, (error) => {
              console.error('Error fetching the geolocation: ', error);
            });
          }

          // Setup the autocomplete feature
          const searchBox = new google.maps.places.SearchBox(searchBoxRef.current);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) {
              return;
            }
            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });
        }
      });
    };

    initializeMap();
  }, []);

  return (
    <>
      <div ref={mapRef} style={containerStyle} />
      <input ref={searchBoxRef} type="text" placeholder="Search location" style={{ width: '240px', padding: '10px', marginTop: '10px' }} />
    </>
  );
}

export default MyGoogleMapComponent;
