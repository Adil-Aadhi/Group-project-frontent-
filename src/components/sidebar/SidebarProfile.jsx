import React from "react";
import { LogOut } from "lucide-react";

const SidebarProfile = ({ user, onLogout }) => {
  return (
    <div className="sidebar-profile">
      <div className="sidebar-profile-avatar">
        {user?.name ? user.name.charAt(0) : "A"}
      </div>

      <div className="sidebar-profile-info">
        <h4>{user?.name || "Admin User"}</h4>
        <p>{user?.role || "Workspace Pro"}</p>
      </div>

      <button className="sidebar-profile-logout" onClick={onLogout} title="Log Out">
        <LogOut size={14} />
      </button>
    </div>
  );
};

export default SidebarProfile;