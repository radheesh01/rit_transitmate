import React, { useState } from 'react';
import './adding.css';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const SeatAllocationForm = () => {
  const [form, setForm] = useState({
    busNumber: '',
    routeNumber: '',
    boardPoints: '',
    rows: 0,
    columns: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const increment = (field) => {
    setForm({ ...form, [field]: Number(form[field]) + 1 });
  };

  const decrement = (field) => {
    setForm({ ...form, [field]: Math.max(0, Number(form[field]) - 1) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pickupPoints = form.boardPoints
      .split(',')
      .map(point => point.trim())
      .filter(point => point !== '');

    const payload = {
      bus_id: `bus_${form.busNumber}`,
      bus_no: form.busNumber,
      route_no: form.routeNumber,
      pickup_points: pickupPoints,
      rows: parseInt(form.rows),
      cols: parseInt(form.columns),
    };

    try {
      const response = await fetch('http://localhost:5000/admin/add_bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Success: ${result.message}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong while submitting the form.');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1>Seat Allocation</h1>

      <input
        type="text"
        name="busID"
        placeholder="Bus ID"
        value={form.bus_id}
        onChange={handleChange}
        className="animated-input"
      />

      <input
        type="text"
        name="busNumber"
        placeholder="Bus Number"
        value={form.busNumber}
        onChange={handleChange}
        className="animated-input"
      />

      <input
        type="text"
        name="routeNumber"
        placeholder="Route number"
        value={form.routeNumber}
        onChange={handleChange}
        className="animated-input"
      />

      <input
        type="text"
        name="boardPoints"
        placeholder="Board Points (comma-separated)"
        value={form.boardPoints}
        onChange={handleChange}
        className="animated-input"
      />

      <div className="number-input">
        <input
          type="number"
          name="rows"
          placeholder="Rows"
          value={form.rows}
          onChange={handleChange}
          className="animated-input"
        />
        <div className="icon-group">
          <FaChevronUp onClick={() => increment('rows')} />
          <FaChevronDown onClick={() => decrement('rows')} />
        </div>
      </div>

      <div className="number-input">
        <input
          type="number"
          name="columns"
          placeholder="Columns"
          value={form.columns}
          onChange={handleChange}
          className="animated-input"
        />
        <div className="icon-group">
          <FaChevronUp onClick={() => increment('columns')} />
          <FaChevronDown onClick={() => decrement('columns')} />
        </div>
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default SeatAllocationForm;
