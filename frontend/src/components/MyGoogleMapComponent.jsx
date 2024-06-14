import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '50vw',
  height: '50vh'
};

function MyGoogleMapComponent() {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 }); // Inicializa com uma posição padrão
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);

  // Opções para o mapa
  const options = {
    disableDefaultUI: true, // desativa controles padrão
    zoomControl: true, // adiciona controle de zoom
  };

  // Carrega a localização do usuário ao iniciar o componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(pos);
          map && map.panTo(pos);
        },
        () => {
          console.error('Error fetching your location');
        }
      );
    }
  }, [map]);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Manipula a seleção do local no autocomplete
  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length === 1) {
      setCenter({
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng()
      });
      map.panTo(new window.google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng()));
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} // Utiliza a chave de API do ambiente
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        <Marker position={center} />  {/* Marcador para a localização atual */}

        <StandaloneSearchBox
          onLoad={ref => searchBoxRef.current = ref}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location"
            style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '240px', height: '32px', padding: '0 12px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses' }}
          />
        </StandaloneSearchBox>
      </GoogleMap>
    </LoadScript>
  );
}

export default MyGoogleMapComponent;