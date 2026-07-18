import React, { useState } from "react";
import { MoreHorizontal, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import './CompetitorCard.css'
import { useNavigate } from "react-router-dom";

// Custom inline SVG for LinkedIn
const LinkedinIcon = ({ size = 13, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// Custom inline SVG for Instagram 
const InstagramIcon = ({ size = 13, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom inline SVG for Twitter / X
const TwitterIcon = ({ size = 13, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function CompetitorCard({ competitor, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate=useNavigate()

  const {
    id,
    company_name,
    website_url,
    industry,
    location,
    description,
    created_at,
    source,
  } = competitor || {};

  const last_checked = "Just now";

  const monitoring = {
    linkedin: false,
    instagram: false,
    twitter: false,
  };


  return (
   <div className="competitor-card">

      <div className="card-content">

        {/* ================= HEADER ================= */}

        <div className="card-header">

          <div className="company-info">

            <div className="company-avatar">
              {company_name?.substring(0, 2).toUpperCase() || "--"}
            </div>

            <div className="company-details">

              <h3 className="company-name">
                {company_name}
              </h3>

              <a
                href={website_url}
                target="_blank"
                rel="noreferrer"
                className="company-website"
              >
                <Globe
                  size={12}
                  className="website-icon"
                />

                {website_url}
              </a>

            </div>

          </div>

          <div className="card-actions">

            <span
              className={`source-badge ${
                (source || "manual").toLowerCase() === "manual"
                  ? "manual"
                  : "auto"
              }`}
            >
              {source || "Manual"}
            </span>

            <div className="menu-wrapper">

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="menu-button"
              >
                <MoreHorizontal size={18} />
              </button>

              {showMenu && (

                <div className="action-menu">

                  <button className="menu-item">
                    Edit competitor
                  </button>

                  <button className="menu-item">
                    Pause monitoring
                  </button>

                  <button
                    className="menu-item delete"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                  >
                    Delete
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= INDUSTRY ================= */}

        <div className="industry-section">

          <span className="industry-badge">
            {industry || "Unknown"}
          </span>

        </div>


      </div>

      {/* ================= FOOTER ================= */}

      <div className="card-footer">

        <div className="status-row">

          <span className="last-checked">

            <span className="status-dot" />

            Last checked {last_checked}

          </span>

          <div className="social-status">

            <span
              className={`social-item ${
                monitoring.linkedin ? "active" : ""
              }`}
            >

              <LinkedinIcon
                size={12}
                className="linkedin-icon"
              />

              {monitoring.linkedin ? "On" : "Off"}

            </span>

            <span
              className={`social-item ${
                monitoring.instagram ? "active" : ""
              }`}
            >

              <InstagramIcon
                size={12}
                className="instagram-icon"
              />

              {monitoring.instagram ? "On" : "Off"}

            </span>

            <span
              className={`social-item ${
                monitoring.twitter ? "active" : ""
              }`}
            >

              <TwitterIcon
                size={12}
                className="twitter-icon"
              />

              {monitoring.twitter ? "On" : "Off"}

            </span>

          </div>

        </div>

        {/* <button
          onClick={() => onAnalyze(competitor)}
          className="analyze-button"
        > */}
        <button
            onClick={() =>
              navigate(`/dashboard/competitors/${id}`, {
                state: { competitor },
              })
            }
            className="analyze-button"
          >
          View Analysis
        </button>

      </div>

    </div>
      );
}