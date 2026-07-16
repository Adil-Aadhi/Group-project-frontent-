import React from "react";
import './MetricCards.css'

export default function MetricCards({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="metric-cards">
      {metrics.map((m, idx) => (
        <div key={idx} className={`metric-card ${m.color ? `metric-card-${m.color}` : ""}`}>
          <span className="metric-card-title">{m.title}</span>
          <span className="metric-card-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
}