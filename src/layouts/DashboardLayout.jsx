import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';
import CrawlerProgress from '../components/Progress/CrawlerProgress';
import { useProgressStore } from '../store/progressStore';

const DashboardLayout = () => {

  const { activeJob, isVisible } = useProgressStore();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Topbar />
        <div className="dashboard-scroll-area">
          <Outlet />
        </div>
      </main>

      {isVisible && activeJob && (
        <CrawlerProgress job={activeJob} />
      )}

    </div>
  );
};

export default DashboardLayout;