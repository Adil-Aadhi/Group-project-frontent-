import React from "react";
import "./DetailTabs.css";

export default function DetailTabs({ activeTab, onChange, compareAvailable }) {
  const tabs = [
    { id: "info", label: "Overview" },
    { id: "compare", label: "Comparison", disabled: !compareAvailable },
  ];

  return (
    <div className="detail-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`detail-tab ${activeTab === tab.id ? "detail-tab-active" : ""}`}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
        >
          {tab.label}
          {tab.disabled && <span className="detail-tab-badge">No data</span>}
        </button>
      ))}
    </div>
  );
}