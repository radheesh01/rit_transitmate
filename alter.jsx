import React, { useState } from 'react';
import './alter.css';

const ChangeRouteForm = () => {
  const [newRoute, setNewRoute] = useState('');
  const [currentRoute, setCurrentRoute] = useState('');

  const handleSubmit = async () => {
    const message = `Instead of ${currentRoute} take ${newRoute}`;

    try {
      const response = await fetch('http://localhost:5000/notify_route_change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_route: currentRoute,  // Pass the current route
          new_route: newRoute,          // Pass the new route
        }),
      });

      const data = await response.json();
      alert(data.message || 'Notification sent!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  return (
    <div className="form-container">
      <h1>Change Routes</h1>
      <div className="form-group">
        <label>New Route:</label>
        <input
          type="text"
          placeholder="Enter new route"
          value={newRoute}
          onChange={(e) => setNewRoute(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Instead of:</label>
        <input
          type="text"
          placeholder="Enter current route"
          value={currentRoute}
          onChange={(e) => setCurrentRoute(e.target.value)}
        />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        SUBMIT
      </button>
    </div>
  );
};

export default ChangeRouteForm;
