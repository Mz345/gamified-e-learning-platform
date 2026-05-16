// src/pages/RoleSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    localStorage.setItem("selectedRole", role); // Persist role
    navigate('/login', { state: { role } });
  };

  return (
    <div className="role-container">
      <h1 className="site-title">LevelUpAcademy</h1>
      <img src="../asset/logo.jpg" alt="LevelUpAcademy Logo" className="logo" />
      <h2 className="role-title">Choose Your Role</h2>
      <p className="role-subtitle">Select how you want to continue with LevelUpAcademy.</p>

      <div className="role-cards">
        <div className="role-card teacher">
          <h3>👩‍🏫 Teacher</h3>
          <p>Create courses, manage students, and inspire learning.</p>
          <button onClick={() => handleRoleSelection("teacher")}>Continue as Teacher</button>
        </div>
        <div className="role-card student">
          <h3>👨‍🎓 Student</h3>
          <p>Take courses, earn badges, and track your learning.</p>
          <button onClick={() => handleRoleSelection("student")}>Continue as Student</button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
