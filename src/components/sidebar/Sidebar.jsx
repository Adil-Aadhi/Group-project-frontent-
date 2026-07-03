import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Globe2, 
  Sparkles, 
  FileText, 
  Zap,
  Menu,
  X 
} from "lucide-react"; 
import Logo from "../common/Logo"; // Dynamic UI shape component wrapper
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import SidebarInsight from "./SidebarInsight";
import SidebarProfile from "./SidebarProfile";
import "./Sidebar.css";

const Sidebar = ({ currentPath = "Overview", onNavigate }) => {
  // Mobile responsive view state tracking toggle
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  const handleNavigation = (path) => {
    onNavigate?.(path);
    setIsMobileExpanded(false); // Auto-closes slide out drawer on link select
  };

  return (
    <>
      {/* Mobile-Only Floating Header Toolbar */}
      <div className="mobile-top-bar">
        <Logo compact={true} /> 
        <button className="mobile-toggle-btn" onClick={toggleMobileSidebar} aria-label="Toggle Menu">
          {isMobileExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Dimmed backdrop background mask behind active mobile drawer sheet */}
      {isMobileExpanded && <div className="sidebar-overlay" onClick={toggleMobileSidebar} />}

      <aside className={`sidebar ${isMobileExpanded ? "mobile-open" : ""}`}>
        {/* Logo Branding Container */}
        <div className="sidebar-logo">
          <Logo compact={false} />
          
          {/* Internal drawer mobile cancel cross-icon button */}
          <button className="mobile-close-internal" onClick={toggleMobileSidebar} aria-label="Close Menu">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Interactive List Tree Link Area */}
        <nav className="sidebar-nav">
          <SidebarSection title="Main Menu" />

          <SidebarItem
            title="Overview"
            icon={<LayoutDashboard size={16} />}
            isActive={currentPath === "Overview"}
            onClick={() => handleNavigation("Overview")}
          />

          <SidebarItem
            title="Competitors"
            icon={<Globe2 size={16} />}
            isActive={currentPath === "Competitors"}
            onClick={() => handleNavigation("Competitors")}
          />

          <SidebarItem
            title="Insights"
            icon={<Sparkles size={16} />}
            badge="AI"
            isActive={currentPath === "Insights"}
            onClick={() => handleNavigation("Insights")}
          />

          <SidebarItem
            title="Reports"
            icon={<FileText size={16} />}
            isActive={currentPath === "Reports"}
            onClick={() => handleNavigation("Reports")}
          />

          <SidebarSection title="Advanced Features" />

          <SidebarItem
            title="CEO Briefing"
            icon={<Zap size={16} />}
            badge="AI"
            isActive={currentPath === "CEO Briefing"}
            onClick={() => handleNavigation("CEO Briefing")}
          />
        </nav>

        {/* Lower Sticky Frame Actions Section */}
        <div className="sidebar-bottom">
          <SidebarInsight />
          <SidebarProfile 
            user={{ name: "Alex Rivers", role: "Workspace Admin" }} 
            onLogout={() => console.log("Logging out account session...")} 
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;