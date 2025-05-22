import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./book.css";

const routeBoardingPoints = {
  "R-1": ["Lift Gate", "Wimco Market", "Ajax", "Periyar Nagar", "Thiruvortiyur Market", "Theradi", "Ellaiamman Koil", "Raja Kadai", "Toll gate", "Kasimedu", "Kalmandapam", "Royapuram Bridge", "Beach station", "Parry's", "Central", "Egmore", "Dasprakash", "Eaga Theatre", "Amjimarai Market"],
  "R-10": ["Thachoor", "Panjetty", "Janappanchatram Bypass", "Karanodai bypass", "Vijaya Nallur", "Toll gate", "Padianallur", "Red Hills", "RedHills Market", "Kavangarai", "Puzhal Jail", "Puzhal Camp", "Velammal College"],
  "R-9": ["Vyasarpadi", "MKB nagar", "E.B. Stop", "Kannadhasan Nagar", "M.R.Nagar", "lakshmi Amman Nagar", "B.B.Road", "Perumbur Market", "Agaram", "Peravalur Road"]
};

const BookSeatForm = () => {
  const [routeNumber, setRouteNumber] = useState("");
  const [boardingOptions, setBoardingOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    gender: "",
    category: "",
    boardPoint: "",
    deboardPoint: "",
    isDisabled: false
  });
  const [allocationResult, setAllocationResult] = useState(null);

  const handleRouteChange = (e) => {
    const value = e.target.value;
    setRouteNumber(value);
    setBoardingOptions(routeBoardingPoints[value] || []);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: formData.regNo,
      name: formData.name,
      gender: formData.gender,
      boarding_point: formData.boardPoint,
      deboarding_point: formData.deboardPoint,
      route_no: routeNumber,
      is_disabled: formData.isDisabled,
      type: formData.category
    };
    try {
      const res = await fetch("http://localhost:5000/allocate", {  // Replace this URL if the backend is deployed elsewhere
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok) {
        setAllocationResult(result.allocation); // Save result if allocation is successful
      } else {
        alert(result.error || "Allocation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="form-container">
      {!allocationResult ? (
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="form-box"
          onSubmit={handleSubmit}
        >
          <h1 className="form-title">BOOK YOUR SEAT</h1>
          <input type="text" name="name" placeholder="Name" className="form-input" value={formData.name} onChange={handleInputChange} />
          <input type="text" name="regNo" placeholder="Register number" className="form-input" value={formData.regNo} onChange={handleInputChange} />
          <input type="text" name="routeNumber" placeholder="Route No. (e.g., R-1)" className="form-input" value={routeNumber} onChange={handleRouteChange} />
          <select className="form-select" name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="" disabled>Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
            <option value="" disabled>Category</option>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
          </select>
          <select className="form-select" name="boardPoint" value={formData.boardPoint} onChange={handleInputChange}>
            <option value="" disabled>Boarding Point</option>
            {boardingOptions.map((point, index) => (
              <option key={index} value={point}>{point}</option>
            ))}
          </select>
          <select className="form-select" name="deboardPoint" value={formData.deboardPoint} onChange={handleInputChange}>
            <option value="" disabled>De-boarding Point</option>
            <option value="RIT">RIT</option>
          </select>
          <label>
            <input type="checkbox" name="isDisabled" checked={formData.isDisabled} onChange={handleInputChange} /> Disability
          </label>
          <motion.button whileHover={{ scale: 1.05, backgroundColor: "#000", color: "#fff" }} whileTap={{ scale: 0.95 }} className="submit-button" type="submit">SUBMIT</motion.button>
        </motion.form>
      ) : (
        <motion.div className="result-box" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="result-title">🎉 Seat Successfully Allocated!</h2>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Register No:</strong> {formData.regNo}</p>
          <p><strong>Boarding:</strong> {formData.boardPoint}</p>
          <p><strong>Deboarding:</strong> {formData.deboardPoint}</p>
          <p><strong>Seat ID:</strong> <span className="highlight-seat">{allocationResult.seat_id}</span></p>
        </motion.div>
      )}
    </div>
  );
};

export default BookSeatForm;
