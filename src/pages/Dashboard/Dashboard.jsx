import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import OverviewCards from '../../components/Dashboard/OverviewCards';
import CompetitorActivityChart from '../../components/Dashboard/CompetitorActivityChart';
import TopAlerts from '../../components/Dashboard/TopAlerts';
import AiInsights from '../../components/Dashboard/AiInsights';
import CompetitorSnapshot from '../../components/Dashboard/CompetitorSnapshot';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page-header">
        <h1>Overview</h1>
        <p>Good morning, Jane — your intelligence briefing for <strong>Thursday, 22 May</strong></p>
        <button className="run-ai-scan-btn">
          <span className="zap-icon">⚡</span> Run AI Scan
        </button>
      </div>

      <OverviewCards />

      <div className="dashboard-grid">
        <div className="grid-left">
          <CompetitorActivityChart />
        </div>
        <div className="grid-right">
          <TopAlerts />
        </div>
      </div>

      <div className="dashboard-grid bottom-grid">
        <div className="grid-left">
          <AiInsights />
        </div>
        <div className="grid-right">
          <CompetitorSnapshot />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
