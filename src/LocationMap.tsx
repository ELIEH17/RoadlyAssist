import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapProvider = {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  rating: number;
};

type LocationMapProps = {
  latitude: number;
  longitude: number;
  providers?: MapProvider[];
};

const userIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const providerIcon = new L.DivIcon({
  className: "provider-map-marker",
  html: `
    <div style="
      width:38px;
      height:38px;
      border-radius:50%;
      background:#111827;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,.25);
      font-size:18px;
    ">
      🔧
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function MoveMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], 14);
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  providers = [],
}: LocationMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      style={{
        width: "100%",
        height: "380px",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        icon={userIcon}
      >
        <Popup>
          <strong>Your vehicle</strong>
          <br />
          Current GPS location
        </Popup>
      </Marker>

      {providers.map((provider) => (
        <Marker
          key={provider.id}
          position={[
            provider.latitude,
            provider.longitude,
          ]}
          icon={providerIcon}
        >
          <Popup>
            <strong>{provider.name}</strong>
            <br />
            {provider.type}
            <br />
            ⭐ {provider.rating}
          </Popup>
        </Marker>
      ))}

      <MoveMap
        latitude={latitude}
        longitude={longitude}
      />
    </MapContainer>
  );
}