import React from "react";
import './CompanyInfo.css'

export default function CompanyInfo({ company, contact }) {
  if (!company) return null;

  return (
    <div className="company-info-card">
      <h3 className="card-title">Company Info</h3>

      <div className="company-info-row">
        <span className="company-info-label">Industry</span>
        <span className="company-info-value">{company.industry || "—"}</span>
      </div>

      <div className="company-info-row">
        <span className="company-info-label">Location</span>
        <span className="company-info-value">{company.location || "—"}</span>
      </div>

      <div className="company-info-row">
        <span className="company-info-label">Description</span>
        <span className="company-info-value">
          {company.description || "No description available."}
        </span>
      </div>

      <div className="company-info-row">
        <span className="company-info-label">Source</span>
        <span className="company-info-value">{company.source || "—"}</span>
      </div>

      {contact && (contact.email || contact.phone) && (
        <>
          <div className="company-info-divider" />
          {contact.email && (
            <div className="company-info-row">
              <span className="company-info-label">Email</span>
              <a href={`mailto:${contact.email}`} className="company-info-value">
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
            <div className="company-info-row">
              <span className="company-info-label">Phone</span>
              <a href={`tel:${contact.phone}`} className="company-info-value">
                {contact.phone}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}