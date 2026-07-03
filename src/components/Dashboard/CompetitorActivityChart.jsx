import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './CompetitorActivityChart.css';

const data = [
  { name: '1 Apr', HubSpot: 60, Salesforce: 55, Marketo: 45, Drift: 40, Intercom: 50 },
  { name: '11 Apr', HubSpot: 62, Salesforce: 58, Marketo: 42, Drift: 45, Intercom: 55 },
  { name: '21 Apr', HubSpot: 65, Salesforce: 56, Marketo: 48, Drift: 38, Intercom: 52 },
  { name: '30 Apr', HubSpot: 58, Salesforce: 60, Marketo: 45, Drift: 42, Intercom: 50 },
];

const CompetitorActivityChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>Competitor Activity</h3>
          <p>Growth score over last 30 days</p>
        </div>
        <div className="chart-filters">
          <button className="filter-btn">7d</button>
          <button className="filter-btn active">30d</button>
          <button className="filter-btn">90d</button>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} ticks={[20, 40, 60, 95]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}
              itemStyle={{ fontSize: '13px' }}
            />
            <Legend 
              iconType="plainline" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
            <Line type="monotone" dataKey="HubSpot" stroke="#f05a28" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Salesforce" stroke="#00a1e0" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Marketo" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Drift" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Intercom" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompetitorActivityChart;
