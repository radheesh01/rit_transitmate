import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";  // Import Socket.IO client

// Fix marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

const LiveLocationMap = () => {
  const [location, setLocation] = useState([13.039512854389384, 80.0452282292308]);

  useEffect(() => {
    const socket = io("http://localhost:5000");  // Connect to the Socket.IO server

    // Listen for location updates from the sender
    socket.on("receiveLocation", (data) => {
      if (data.latitude && data.longitude) {
        setLocation([data.latitude, data.longitude]);  // Update location state
      }
    });

    return () => {
      socket.disconnect();  // Cleanup the connection when the component is unmounted
    };
  }, []);

  // Create a custom icon
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div>
      <h2>Live Location Viewer</h2>
      <MapContainer 
        center={location} 
        zoom={13} 
        style={{
          height: "80vh", 
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {/* Marker with custom icon */}
        <Marker position={location} icon={customIcon}>
          <Popup>Live Location</Popup>
        </Marker>
        <Recenter position={location} />
      </MapContainer>
    </div>
  );
};

export default LiveLocationMap;
