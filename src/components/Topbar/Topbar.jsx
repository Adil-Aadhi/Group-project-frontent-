import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Zap } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import './Topbar.css';
import ThemeToggle from '../ui/ThemeToggle';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/competitors': 'Competitors',
  '/dashboard/insights': 'Insights',
  '/dashboard/reports': 'Reports',
  '/dashboard/ceo-briefing': 'CEO Briefing',
};

const Topbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();

  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-section">
          <h2>{pageTitle}</h2>
          <span className="live-badge">Live</span>
        </div>

        {/* <div className="search-section">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search competitors, alerts, insights..."
            className="search-input"
          />
          <span className="shortcut-hint">⌘K</span>
        </div> */}
      </div>

     

        {/* <button className="quick-scan-btn">
          <Zap size={16} /> Quick Scan
        </button> */}

      {/* </div> */}

      <div className="topbar-right">
         <ThemeToggle />
        <div className="notification-container">
          <button className="notif-btn" onClick={toggleNotif}>
            <Bell size={20} />
            <span className="notif-dot"></span>
          </button>
          {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} />}
        </div>

        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">Jane Dawson</span>
            <span className="user-role">CEO at Acme Corp</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;