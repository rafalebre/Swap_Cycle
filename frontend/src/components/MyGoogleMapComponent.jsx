import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '50vw',
  height: '50vh'
};

function MyGoogleMapComponent({ googleMapsApiKey, libraries }) {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCenter(pos);
        map && map.panTo(pos);
      },
      () => console.error('Error fetching your location')
    );
  }, [map]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length === 1) {
      const loc = { lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() };
      setCenter(loc);
      map.panTo(loc);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} />
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
  );
}

export default MyGoogleMapComponent;
