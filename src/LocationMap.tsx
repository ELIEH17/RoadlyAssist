import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LocationMapProps = {
  latitude: number;
  longitude: number;
};

function MoveMap({
  latitude,
  longitude,
}: LocationMapProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], 16);
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationMap({
  latitude,
  longitude,
}: LocationMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "18px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        icon={markerIcon}
      >
        <Popup>Your vehicle is here</Popup>
      </Marker>

      <MoveMap
        latitude={latitude}
        longitude={longitude}
      />
    </MapContainer>
  );
}