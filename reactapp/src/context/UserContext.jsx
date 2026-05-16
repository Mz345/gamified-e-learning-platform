import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '/default-avatar.png');
  const [name, setName] = useState(localStorage.getItem('name') || 'User');
  const [role, setRole] = useState(localStorage.getItem('role') || 'student');
  const [id, setId] = useState(localStorage.getItem('id') || null); // <-- Added id

  useEffect(() => {
    localStorage.setItem('avatar', avatar);
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  useEffect(() => {
    if (id) {
      localStorage.setItem('id', id);
    }
  }, [id]);

  return (
    <UserContext.Provider value={{ avatar, setAvatar, name, setName, role, setRole, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
