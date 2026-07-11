import React, { useRef, useEffect } from 'react';
import './NotificationDropdown.css';

const NotificationDropdown = ({ anchorRef, onClose }) => {
  const dropdownRef = useRef(null);

  const rect = anchorRef.current?.getBoundingClientRect();

  const dropdownStyle = rect
    ? {
        position: "fixed",
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
    }
    : {};

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          !anchorRef.current?.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const notifications = [
    {
      id: 1,
      title: 'Price drop detected',
      message: 'Competitor X reduced pricing by 15%',
      time: '5 min ago',
      isNew: true,
      hasPreview: true
    },
    {
      id: 2,
      title: 'New competitor identified',
      message: 'Startup Y entered your market',
      time: '1 hour ago',
      isNew: true,
      hasPreview: false
    },
    {
      id: 3,
      title: 'Weekly report ready',
      message: 'Your intelligence digest is available',
      time: '3 hours ago',
      isNew: true,
      hasPreview: false
    }
  ];

  return (
    <div className="notification-dropdown" ref={dropdownRef}  style={dropdownStyle}>
      <div className="notif-header">
        <h3>Notifications</h3>
      </div>
      <div className="notif-list">
        {notifications.map((notif) => (
          <div key={notif.id} className="notif-item">
            <div className="notif-indicator">
              {notif.isNew && <span className="dot"></span>}
            </div>
            <div className="notif-content">
              <div className="notif-title-row">
                <h4>{notif.title}</h4>
                {notif.hasPreview && <button className="preview-btn">Preview</button>}
              </div>
              <p>{notif.message}</p>
              <span className="notif-time">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="notif-footer">
        <button className="view-all-btn">View all notifications</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
