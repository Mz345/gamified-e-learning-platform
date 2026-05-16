import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import '../styles/SideBar.css';

const Sidebar = () => {
  const { avatar, name, role } = useContext(UserContext);

  // Backend URL to prefix relative image paths
  const backendURL = 'http://localhost:5000';

  // Validate and fallback avatar URL
  const defaultAvatar = '/avatar/avatar.svg';

  // Check if avatar exists and is valid
  const hasValidAvatar = avatar && avatar !== 'null' && avatar !== 'undefined';

  // If avatar starts with /uploads, prefix backend URL
  const avatarURL =
    hasValidAvatar && avatar.startsWith('/uploads')
      ? backendURL + avatar
      : hasValidAvatar
      ? avatar
      : defaultAvatar;

  const effectiveRole = (role || 'student').toLowerCase();
  const effectiveName = name || 'User';

  // Save avatar to localStorage to persist across reloads
  useEffect(() => {
    if (hasValidAvatar) {
      localStorage.setItem('profileImage', avatar);
    } else if (!localStorage.getItem('profileImage')) {
      localStorage.setItem('profileImage', defaultAvatar);
    }
  }, [avatar, hasValidAvatar]);

  return (
    <div className="sidebar">
      <div className="profile-section">
        <img src={avatarURL} alt="Profile" className="profile-img" />
        <h3 className="profile-name">{effectiveName}</h3>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink
            to={effectiveRole === 'teacher' ? '/teacherhome' : '/studenthome'}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            ℹ️ About
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            ⚙️ Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            💬 Messages
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
