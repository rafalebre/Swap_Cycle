import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function GoogleMapsAutocomplete({ onPlaceSelected }) {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const google = window.google;
      const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['address'] // Configura para buscar apenas endereços
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.formatted_address && onPlaceSelected) {
          onPlaceSelected(
            place.formatted_address,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        }
      });
    });
  }, [onPlaceSelected]);

  return (
    <input
      ref={autocompleteRef}
      type="text"
      placeholder="Search for a location"
      style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
    />
  );
}

export default GoogleMapsAutocomplete;
