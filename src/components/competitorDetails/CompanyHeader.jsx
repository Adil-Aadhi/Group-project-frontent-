import React from "react";
import "./CompanyHeader.css"

export default function CompanyHeader({ company }) {
  if (!company) return null;

  return (
    <div className="company-header">
      <div className="company-header-main">
        <h1 className="company-header-name">{company.company_name}</h1>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="company-header-website"
          >
            {company.website}
          </a>
        )}
      </div>

      <div className="company-header-meta">
        {company.industry && company.industry !== "—" && (
          <span className="company-header-tag">{company.industry}</span>
        )}
        {company.location && company.location !== "—" && (
          <span className="company-header-tag">{company.location}</span>
        )}
        {company.lastChecked && (
          <span className="company-header-updated">
            Last updated: {new Date(company.lastChecked).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}