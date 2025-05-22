import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome</h1>
      <h2 className="welcome-subtitle">RIT TRANSITMATE</h2>
      <button className="get-started-btn" onClick={() => navigate('/intro')}>
        GET STARTED
      </button>
    </div>
  );
};

export default WelcomeScreen;