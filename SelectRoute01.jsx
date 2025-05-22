import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectRoute01.css';

const SelectRoute01 = () => {
  const [route, setRoute] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate('/eta');
    } else {
      alert("Please select a route number.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">SELECT ROUTE</h1>
      <div className="dropdown-section">
        <label className="label">Route no :</label>
        <select
          className="dropdown"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        >
          <option value="">-- Select Route --</option>
          <option value="R-1">R-1</option>
          <option value="R-9">R-9</option>
          <option value="R-10">R-10</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <button className="locate-button" onClick={handleClick}>LOCATE</button>
    </div>
  );
};

export default SelectRoute01;