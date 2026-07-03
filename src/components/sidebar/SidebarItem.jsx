// Contains a single navigation menu item (Overview, Competitors, Insights, etc.)

import React from "react";

const SidebarItem = ({ title, icon, badge, isActive, onClick }) => {
  return (
    <button 
      className={`sidebar-item ${isActive ? "is-active" : ""}`} 
      onClick={onClick}
    >
      {icon && <span className="sidebar-item__icon">{icon}</span>}
      <span className="sidebar-item__title">{title}</span>
      {badge && <span className="sidebar-item__badge">{badge}</span>}
      {isActive && <span className="sidebar-item__indicator" />}
    </button>
  );
};

export default SidebarItem;