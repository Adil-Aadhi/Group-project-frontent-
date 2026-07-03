import React from 'react';
import { TrendingUp, ArrowUpRight, CircleAlert } from 'lucide-react';
import './OverviewCards.css';

const OverviewCards = () => {
  const cards = [
    {
      title: 'COMPETITORS TRACKED',
      value: '12',
      trend: '+2 this month',
      trendType: 'neutral',
      icon: <TrendingUp size={16} />,
      progressClass: 'progress-neutral'
    },
    {
      title: 'ALERTS THIS WEEK',
      value: '143',
      trend: '↑ 18 since Monday',
      trendType: 'positive',
      icon: <span className="dot dot-danger"></span>,
      progressClass: 'progress-danger'
    },
    {
      title: 'AVG COMPETITOR GROWTH',
      value: '+9.2%',
      trend: 'vs. 6.1% last month',
      trendType: 'positive',
      icon: <ArrowUpRight size={16} className="text-success" />,
      progressClass: 'progress-success',
      badge: 'Preview'
    },
    {
      title: 'NEW OPPORTUNITIES',
      value: '7',
      trend: '3 high-priority',
      trendType: 'neutral',
      icon: <span className="dot dot-primary"></span>,
      progressClass: 'progress-primary'
    }
  ];

  return (
    <div className="overview-cards">
      {cards.map((card, index) => (
        <div key={index} className="overview-card">
          {card.badge && <div className="card-badge">{card.badge}</div>}
          <div className="card-header">
            <h5>{card.title}</h5>
            <div className="card-icon">{card.icon}</div>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-trend">{card.trend}</div>
          <div className={`card-progress ${card.progressClass}`}></div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
