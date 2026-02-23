import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

function Routing({ userLoc, hospital }) {
  const map = useMap();

  useEffect(() => {
    if (!userLoc) return;

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(userLoc.lat, userLoc.lng),
        L.latLng(hospital.location.lat, hospital.location.lng)
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }]
      }
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [userLoc]);

  return null;
}

function Navigation() {
  const location = useLocation();
  const hospital = location.state?.hospital;

  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLoc({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  if (!hospital) return <h2>No hospital data</h2>;

  return (
    <MapContainer
      center={[hospital.location.lat, hospital.location.lng]}
      zoom={13}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {userLoc && (
        <>
          <Marker position={[userLoc.lat, userLoc.lng]} />
          <Marker position={[hospital.location.lat, hospital.location.lng]} />
          <Routing userLoc={userLoc} hospital={hospital} />
        </>
      )}
    </MapContainer>
  );
}

export default Navigation;