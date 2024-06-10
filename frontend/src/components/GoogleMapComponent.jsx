import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const GoogleMapComponent = () => {
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });

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
          () => {
            console.error("Error accessing the GPS of the device.");
          }
        );
      }
    };

    fetchCurrentLocation();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {/* Child components, like markers, info windows, etc. will go here */}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
