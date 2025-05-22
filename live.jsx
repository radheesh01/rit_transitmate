import React, { useState, useRef } from "react";
import io from "socket.io-client";
import "./live.css";

// Connect to the backend server
const socket = io("http://localhost:5000");

const ShareLocation = () => {
  const [sharing, setSharing] = useState(false);
  const watchIdRef = useRef(null);

  const startSharing = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setSharing(true);

    // Start tracking the location
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude });  // Send location to backend
        console.log("Location sent:", latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve location.");
        setSharing(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("Stopped sharing location.");
    }
    setSharing(false);
  };

  return (
    <div className="container">
      <h1>SHARE YOUR LOCATION</h1>
      <p>Click the button below to start sharing your live location.</p>
      <button
        className="share-button"
        onClick={sharing ? stopSharing : startSharing}
      >
        {sharing ? "STOP SHARING" : "SHARE LIVE"}
      </button>
    </div>
  );
};

export default ShareLocation;
