import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ cityNames, counts }) => {
  const INITIAL_CENTER = [-74.0242, 40.6941];
  const INITIAL_ZOOM = 2.51;

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const mapRef = useRef();
  const mapContainerRef = useRef();

  const geocodeCities = async (cities) => {
    const coordinates = await Promise.all(
      cities.map(async (city) => {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            city
          )}.json?access_token=pk.eyJ1Ijoic3VuaWx2IiwiYSI6ImNsa284ZHZzcTA1a3QzZG4xa3lrdW93b3cifQ.Yr8N4SSWR8e2_4TMvryABw`
        );
        if (response.data.features.length) {
          const { center } = response.data.features[0];
          return { name: city, lng: center[0], lat: center[1] };
        }
        return null;
      })
    );
    return coordinates.filter((coord) => coord !== null);
  };

  useEffect(() => {
    const initializeMap = async () => {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic3VuaWx2IiwiYSI6ImNsa284ZHZzcTA1a3QzZG4xa3lrdW93b3cifQ.Yr8N4SSWR8e2_4TMvryABw";
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11", // Default style
        center: center,
        zoom: zoom,
      });

      const cityCoordinates = await geocodeCities(cityNames);
      cityCoordinates.forEach(({ name, lng, lat }, index) => {
        const count = counts[index] || 0;
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h4>${name}</h4><p>Count: ${count}</p>`
            )
          )
          .addTo(mapRef.current);
      });

      mapRef.current.on("move", () => {
        const mapCenter = mapRef.current.getCenter();
        const mapZoom = mapRef.current.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      });
    };

    initializeMap();

    return () => {
      mapRef.current.remove();
    };
  }, [cityNames, counts]);

  return (
    <>
      <div className="">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ height: "90%", width: "100%", borderRadius: "25px" }}
      />
    </>
  );
};

export default Map;
