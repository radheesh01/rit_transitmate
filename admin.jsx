import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaPlus, FaBus } from 'react-icons/fa';
import './admin.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: 'WATCH LIVE',
      icon: <FaMapPin className="icon" />,
      path: '/viewloc',
    },
    {
      label: 'Add Bus',
      icon: <FaPlus className="icon" />,
      path: '/add',
    },
    {
      label: 'Change Routes',
      icon: <FaBus className="icon" />,
      path: '/alter',
    },
  ];

  return (
    <div className="admin-container">
      <h1>ADMIN USE</h1>
      <p className="subtext">track and maintain buses</p>
      <div className="button-grid">
        {buttons.map((btn, index) => (
          <div
            key={index}
            className="admin-button"
            onClick={() => navigate(btn.path)}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;