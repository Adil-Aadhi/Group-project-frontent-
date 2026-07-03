import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
