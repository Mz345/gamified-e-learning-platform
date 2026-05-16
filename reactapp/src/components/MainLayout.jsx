import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar'; // Safer to use full path
import '../styles/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
