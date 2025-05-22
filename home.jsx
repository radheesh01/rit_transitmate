import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChair, FaMapMarkerAlt, FaBus } from "react-icons/fa";
import "./home.css";

const TransitmateButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">WELCOME</h1>
      <h2 className="subtitle">TO RIT TRANSMITATE</h2>
      <div className="button-grid">
        <button className="jump-button" onClick={() => navigate("/book")}>
          <FaChair className="icon" />
          <span>Book</span>
        </button>
        <button className="jump-button" onClick={() => navigate("/viewloc")}>
          <FaMapMarkerAlt className="icon" />
          <span>Locate</span>
        </button>
        <button
          className="jump-button"
          onClick={() => window.open("https://rittransport.com/", "_blank")}
        >
          <FaBus className="icon" />
          <span>View Routes</span>
        </button>
      </div>
    </div>
  );
};

export default TransitmateButtons;