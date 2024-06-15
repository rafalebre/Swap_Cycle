import React, { useEffect, useRef, useState } from 'react';
import { Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: '30vw',
  height: '30vh'
};

function MyGoogleMapComponent({ googleMapsApiKey }) {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsApiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      const google = window.google;
      const initialMap = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 10
      });
      setMap(initialMap);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCenter(pos);
          initialMap.panTo(pos);
        },
        () => console.error('Error fetching your location')
      );
    });
  }, [googleMapsApiKey, center]); // Adicionando 'center' às dependências

  useEffect(() => {
    if (map) {
      const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places && places.length === 1) {
          const loc = { lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() };
          setCenter(loc);
          map.panTo(loc);
        }
      });
    }
  }, [map]);

  return (
    <>
      <div ref={mapRef} style={containerStyle} />
      <StandaloneSearchBox
        onLoad={ref => searchBoxRef.current = ref}
      >
        <input
          type="text"
          placeholder="Search location"
          style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '240px', height: '32px', padding: '0 12px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses' }}
        />
      </StandaloneSearchBox>
      {map && <Marker position={center} map={map} />}
    </>
  );
}

export default MyGoogleMapComponent;
