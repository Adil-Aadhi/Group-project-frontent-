//Displays section titles to group related navigation items. mainmenu,advanced features
// Displays a section heading for grouping sidebar menu items.

// const SidebarSection = ({ title }) => {
//   return (
//     <div className="sidebar-section">
//       <p>{title}</p>
//     </div>
//   );
// };

// export default SidebarSection;

import React from "react";

const SidebarSection = ({ title }) => {
  return (
    <div className="sidebar-section">
      <p>{title}</p>
    </div>
  );
};

export default SidebarSection;