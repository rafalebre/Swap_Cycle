import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '50vw',
  height: '50vh',
  margin: 'auto',
  marginBottom: '20px',
};

const GoogleMapComponent = ({ onPlaceSelected }) => {
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    // Função para obter a localização atual do usuário
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error accessing the GPS of the device: ", error);
          }
        );
      }
    };

    fetchCurrentLocation();
  }, []);

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
      if (onPlaceSelected) {
        onPlaceSelected(place.formatted_address); // Update the address input with selected place
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter location"
          style={{ width: '100%', height: '40px', paddingLeft: '10px' }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}  // Closer zoom
        onClick={(e) => {
          // Update the address input on map click
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          // You can use Google Geocoding API here to get the address from lat and lng if needed
          onPlaceSelected(`Lat: ${lat}, Lng: ${lng}`);
        }}
      >
        <Marker position={center} />  
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
