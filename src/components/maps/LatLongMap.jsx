import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const LatLongMap = ({ locations }) => {
  const INITIAL_CENTER = [-122.30839, 47.610365]; // Default center
  const INITIAL_ZOOM = 4.51;

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    const initializeMap = () => {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic3VuaWx2IiwiYSI6ImNsa284ZHZzcTA1a3QzZG4xa3lrdW93b3cifQ.Yr8N4SSWR8e2_4TMvryABw";
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11", // Default style
        center: center,
        zoom: zoom,
      });

      locations.forEach(({ long, lat, count }, index) => {
        new mapboxgl.Marker()
          .setLngLat([long, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h4>Location ${index + 1}</h4><p>Count: ${count}</p>` // Customize your popup content as needed
            )
          )
          .addTo(mapRef.current);
      });

      mapRef.current.on("move", () => {
        const mapCenter = mapRef.current.getCenter();
        const mapZoom = mapRef.current.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]); // Correct the property names to lng and lat
        setZoom(mapZoom);
      });
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [locations]);

  return (
    <>
      <div>
        Longitude: {center ? center[0].toFixed(4) : "N/A"} | Latitude:{" "}
        {center ? center[1].toFixed(4) : "N/A"} | Zoom:{" "}
        {zoom ? zoom.toFixed(2) : "N/A"}
      </div>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ height: "80%", width: "100%", borderRadius: "25px" }}
      />
    </>
  );
};

export default LatLongMap;
