import React from 'react';
import Topbar from '../components/Topbar/Topbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Topbar />
      <main className="dashboard-main">
        <div className="dashboard-content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
