import React from "react";
import './AISummary.css'

export default function AISummary({ summary }) {
  return (
    <div className="ai-summary-card">
      <h3 className="card-title">AI Summary</h3>
      {summary ? (
        <p className="ai-summary-text">{summary}</p>
      ) : (
        <p className="ai-summary-empty">No summary available yet.</p>
      )}
    </div>
  );
}