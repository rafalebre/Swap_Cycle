import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: "40vw", // Ajustado para 40% da largura da viewport
  height: "40vh", // Ajustado para 40% da altura da viewport
};

function SearchMapComponent() {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"],
      });

      loader.load().then(() => {
        if (mapRef.current) {
          const google = window.google;
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 10,
          });

          // Atualizar o estado global ou local com os bounds sempre que o mapa é movido ou o zoom é alterado
          const updateBounds = () => {
            if (!mapRef.current || !window.google || !map.getBounds()) return;

            
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast(); // canto nordeste
            const sw = bounds.getSouthWest(); // canto sudoeste
            window.dispatchEvent(new CustomEvent("mapBoundsChanged", {
              detail: {
                north: ne.lat(),
                east: ne.lng(),
                south: sw.lat(),
                west: sw.lng()
              }
            }));
          };

          map.addListener('idle', updateBounds);
          map.addListener('dragend', updateBounds);
          map.addListener('zoom_changed', updateBounds);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.setCenter(currentLocation);
                map.setZoom(10); // Configurado para um zoom que aproxima a visualização para um raio de 10 a 20 km
                updateBounds(); // Atualizar bounds após definir a localização
              },
              (error) => {
                console.error("Error fetching the geolocation: ", error);
              }
            );
          }

          const searchBox = new google.maps.places.SearchBox(searchBoxRef.current);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) {
              return;
            }
            map.fitBounds(places[0].geometry.viewport);
            updateBounds(); // Atualizar bounds após a pesquisa de localização
          });
        }
      });
    };

    initializeMap();
  }, []);

  return (
    <>
      <div ref={mapRef} style={containerStyle} />
      <input
        ref={searchBoxRef}
        type="text"
        placeholder="Search location"
        style={{ width: "240px", padding: "10px", marginTop: "10px" }}
      />
    </>
  );
}

export default SearchMapComponent;
