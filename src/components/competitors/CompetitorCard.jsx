import React, { useState } from "react";
import { MoreHorizontal, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

  // Destructure safe defaults directly from database names
  const {
    id,
    name = "HubSpot",
    website = "hubspot.com",
    category = "CRM / Marketing",
    growth_score = 68,
    growth_change = "+14.2",
    type = "Manual",
    last_checked = "18 min ago",
    monitoring = { linkedin: true, instagram: true, twitter: true }
  } = competitor || {};

  const isPositive = !growth_change.toString().startsWith("-");

  return (
    <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[270px] relative font-sans">
      
      {/* Container holding top section content tightly */}
      <div>
        {/* Top Identity Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Softly curved Avatar Block */}
            <div className="w-11 h-11 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-base shadow-sm shadow-orange-500/10">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{name}</h3>
              <a 
                href={`https://${website}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-0.5"
              >
                <Globe size={12} className="text-slate-400" /> {website}
              </a>
            </div>
          </div>

          {/* Action pills & options box anchor */}
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border capitalize ${
              type.toLowerCase() === "manual" 
                ? "bg-slate-50 text-slate-500 border-slate-100" 
                : "bg-blue-50 text-blue-600 border-blue-100/50"
            }`}>
              {type}
            </span>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1.5 text-xs font-semibold text-slate-600">
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Edit competitor</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Pause monitoring</button>
                  <button 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50" 
                    onClick={() => { onDelete(id); setShowMenu(false); }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Pill Tag Block */}
        <div className="mb-5 flex">
          <span className="px-2.5 py-0.5 bg-orange-50/60 text-orange-600 text-[11px] font-bold rounded-lg border border-orange-100/40">
            {category}
          </span>
        </div>

        {/* Progress Metrics Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 font-medium">Growth Score</span>
            <div className="flex items-center gap-1 text-slate-800">
              <span className="text-sm font-black">{growth_score}</span>
              <span className={`flex items-center text-[11px] ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                {isPositive ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
                {isPositive ? "+" : ""}{growth_change}%
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isPositive ? "bg-emerald-500" : "bg-orange-500"}`} 
              style={{ width: `${Math.min(growth_score, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Baseline structural items grouping footer elements cleanly at the bottom */}
      <div className="flex flex-col gap-3">
        {/* Border Dividers & Live Status Nodes */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Last checked {last_checked}
          </span>

          <div className="flex items-center gap-2.5">
            <span className={`flex items-center gap-0.5 ${monitoring.linkedin ? "text-slate-600" : "text-slate-300"}`}>
              <LinkedinIcon size={12} className={monitoring.linkedin ? "text-blue-600" : "text-slate-300"} /> 
              {monitoring.linkedin ? "On" : "Off"}
            </span>
            <span className={`flex items-center gap-0.5 ${monitoring.instagram ? "text-slate-600" : "text-slate-300"}`}>
              <InstagramIcon size={12} className={monitoring.instagram ? "text-pink-500" : "text-slate-300"} /> 
              {monitoring.instagram ? "On" : "Off"}
            </span>
            <span className={`flex items-center gap-0.5 ${monitoring.twitter ? "text-slate-600" : "text-slate-300"}`}>
              <TwitterIcon size={12} className={monitoring.twitter ? "text-sky-400" : "text-slate-300"} /> 
              {monitoring.twitter ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* View Details Call To Action Button */}
        <button className="w-full py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-xl text-xs font-bold text-slate-700 transition-all text-center">
          View Analysis
        </button>
      </div>

    </div>
  );
}