import React from 'react';
import './TopAlerts.css';

const alerts = [
  {
    id: 1,
    company: 'HubSpot',
    abbr: 'HS',
    color: '#f05a28',
    message: 'Dropped Starter pricing by 20% — potential churn trigger',
    time: '18m ago'
  },
  {
    id: 2,
    company: 'Salesforce',
    abbr: 'SF',
    color: '#00a1e0',
    message: 'Launched Einstein Copilot for SMB segment',
    time: '1h ago'
  },
  {
    id: 3,
    company: 'Drift',
    abbr: 'DR',
    color: '#10b981',
    message: 'LinkedIn engagement up 340% — new content push',
    time: '3h ago'
  },
  {
    id: 4,
    company: 'Marketo',
    abbr: 'MK',
    color: '#8b5cf6',
    message: 'Acquired Bizible attribution platform for $95M',
    time: '6h ago'
  },
  {
    id: 5,
    company: 'Intercom',
    abbr: 'IC',
    color: '#f59e0b',
    message: 'Added GPT-4o support to Fin AI agent',
    time: '1d ago'
  }
];

const TopAlerts = () => {
  return (
    <div className="alerts-card">
      <div className="alerts-header">
        <div>
          <h3>Top Alerts This Week</h3>
          <p>Ranked by impact score</p>
        </div>
        <div className="new-badge">3 new</div>
      </div>

      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <div 
              className="alert-avatar" 
              style={{ backgroundColor: alert.color }}
            >
              {alert.abbr}
            </div>
            <div className="alert-content">
              <div className="alert-title-row">
                <h4>
                  {alert.company}
                  <span className="dot dot-danger alert-dot"></span>
                </h4>
                <span className="alert-time">{alert.time}</span>
              </div>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="alerts-footer">
        <button className="view-all-alerts">View all alerts &gt;</button>
      </div>
    </div>
  );
};

export default TopAlerts;
