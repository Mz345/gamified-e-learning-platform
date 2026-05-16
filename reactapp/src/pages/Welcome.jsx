// pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1 className="w-site-title">LevelUpAcademy</h1>
      <img src='../asset/logo.jpg' alt="LevelUpAcademy Logo" className="logo" />
      <h1 className="main-title">
        Learn, Play, <span className="highlight">Achieve!</span>
      </h1>
      <b><p className="subtitle">Welcome to LevelUpAcademy: Where education becomes an adventure</p></b>

      <div className="features">
        <div className="feature-line">
          <span className="scroll scroll-left delay-0">🎮 Engage with Gamified Learning</span>
        </div>
        <div className="feature-line">
          <span className="scroll scroll-right delay-1">🏆 Conquer Exciting Learning Challenges</span>
        </div>
        <div className="feature-line">
          <span className="scroll scroll-left delay-2">📘 Dive into Interactive Learning</span>
        </div>
      </div>



      <button className="start-btn" onClick={() => navigate('/select-role')}>
        Start Your Adventure →
      </button>
    </div>
  );
}

export default Welcome;
