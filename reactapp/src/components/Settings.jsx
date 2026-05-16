import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/Settings.css'; // Ensure you have this CSS file for styling

const SettingsPage = () => {
  const { avatar, setAvatar, role, id } = useContext(UserContext);
  const [tempAvatar, setTempAvatar] = useState(avatar || '');
  // eslint-disable-next-line no-unused-vars
 
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const backendURL = 'http://localhost:5000';

  // Fix here: ensure tempAvatar is string before calling startsWith

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploading(true);
    setMessage('');

    try {
      if (!id || !role) {
        setMessage('User ID or role missing. Please login again.');
        setUploading(false);
        return;
      }

      const res = await fetch(
        `${backendURL}/api/profile/upload-profile/${role}/${id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTempAvatar(data.profileImage);
        setMessage('Profile image uploaded successfully!');
        setAvatar(data.profileImage); // Update context avatar here
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch (error) {
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    setAvatar(tempAvatar);
    
    localStorage.setItem('avatar', tempAvatar);

    setMessage('Changes saved!');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
<div className="settings-page">
  <h2>Settings</h2>

  <form onSubmit={handleSubmit}>
    <div className="setting-section">
      <label htmlFor="avatar-upload">Change Avatar:</label>
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={handleAvatarChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading avatar...</p>}
      {/* Removed avatar preview image here */}
    </div>

    

    
  </form>

  {message && <p>{message}</p>}

  <button className="logout-btn" onClick={handleLogout}>
    🚪 Logout
  </button>
</div>

  );
};

export default SettingsPage;
