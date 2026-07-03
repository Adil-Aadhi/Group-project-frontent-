import React from 'react';
import './CompetitorSnapshot.css';

const CompetitorSnapshot = () => {
  return (
    <div className="snapshot-card">
      <div className="snapshot-header">
        <div>
          <h3>Competitor Snapshot</h3>
          <p>Live performance overview</p>
        </div>
        <button className="full-table-btn">Full table &gt;</button>
      </div>
      <div className="snapshot-content">
        <table className="snapshot-table">
          <thead>
            <tr>
              <th>COMPETITOR</th>
              <th>SENTIMENT</th>
              <th>GROWTH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="comp-name">
                  <div className="comp-avatar" style={{backgroundColor: '#f05a28'}}>HS</div>
                  <span>HubSpot</span>
                </div>
              </td>
              <td><span className="sentiment positive">Positive</span></td>
              <td>+12%</td>
            </tr>
            <tr>
              <td>
                <div className="comp-name">
                  <div className="comp-avatar" style={{backgroundColor: '#00a1e0'}}>SF</div>
                  <span>Salesforce</span>
                </div>
              </td>
              <td><span className="sentiment neutral">Neutral</span></td>
              <td>+8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorSnapshot;
