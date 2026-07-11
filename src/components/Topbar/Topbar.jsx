import React, { useState, useRef  } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Zap } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import './Topbar.css';
import ThemeToggle from '../ui/ThemeToggle';

import { createPortal } from "react-dom";

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

  const bellRef = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-section">
          <h2>{pageTitle}</h2>
          <span className="live-badge">Live</span>
        </div>
      </div>

     


      {/* </div> */}

      <div className="topbar-right">
         <ThemeToggle />
        <div className="notification-container">
          <button className="notif-btn" onClick={toggleNotif} ref={bellRef}>
            <Bell size={20} />
            <span className="notif-dot"></span>
          </button>
          {isNotifOpen &&
            createPortal(
                <NotificationDropdown
                    anchorRef={bellRef}
                    onClose={() => setIsNotifOpen(false)}
                />,
                document.body
            )}
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