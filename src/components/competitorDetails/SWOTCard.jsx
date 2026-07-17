import React from "react";
import './SWOTCard.css'

function ListBlock({ title, items, emptyText }) {
  return (
    <div className="swot-block">
      <h4 className="swot-block-title">{title}</h4>
      {items && items.length > 0 ? (
        <ul className="swot-block-list">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="swot-block-empty">{emptyText}</p>
      )}
    </div>
  );
}

export default function SWOTCard({ swot }) {
  if (!swot) return null;

  return (
    <div className="swot-card">
      <h3 className="card-title">Services & Themes</h3>

      <ListBlock
        title="Services"
        items={swot.services}
        emptyText="No services listed."
      />
      <ListBlock
        title="Products"
        items={swot.products}
        emptyText="No products listed."
      />
      <ListBlock
        title="Positive Themes"
        items={swot.positive_themes}
        emptyText="No positive themes found yet."
      />
      <ListBlock
        title="Negative Themes"
        items={swot.negative_themes}
        emptyText="No negative themes found yet."
      />
    </div>
  );
}