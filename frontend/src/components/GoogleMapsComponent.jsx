import React, { useState, useCallback } from 'react';
import { GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = { lat: -23.55052, lng: -46.633308 }; // São Paulo como fallback

const libraries = ['places'];

const GoogleMapsComponent = ({ onPlaceSelected }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleLoad = useCallback((autoC) => {
        setAutocomplete(autoC);
    }, []);

    const handlePlaceChanged = useCallback(() => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            onPlaceSelected(place);
            if (map) {
                map.panTo(place.geometry.location);
                new window.google.maps.marker.AdvancedMarkerElement({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            }
        }
    }, [autocomplete, map, onPlaceSelected]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Autocomplete
                onLoad={handleLoad}
                onPlaceChanged={handlePlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Enter location"
                    style={{ boxSizing: `border-box`, border: `1px solid transparent`, width: `240px`, height: `32px`, padding: `0 12px`, borderRadius: `3px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses`, position: "absolute", top: "10px", left: "50%", marginLeft: "-120px" }}
                />
            </Autocomplete>
        </GoogleMap>
    ) : <></>;
};

export default GoogleMapsComponent;