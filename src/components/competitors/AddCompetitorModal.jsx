import React, { useState } from "react";
import { X } from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Healthcare / MedTech",
  "E-commerce / Retail",
  "SaaS / Software",
  "Fintech",
  "CRM / Marketing",
  "Education",
  "Other",
];

export default function AddCompetitorModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, website, linkedin,industry, instagram, twitter });
    // Reset fields after save
    setName("");
    setWebsite("");
    setIndustry(INDUSTRY_OPTIONS[0]);
    setLinkedin("");
    setInstagram("");
    setTwitter("");
  };

  return (
    <div className="premium-modal-backdrop">
      <div className="premium-modal-box">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-slate-50 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add New Competitor</h2>
          <p className="text-sm text-slate-400">Enter competitor company details and social links.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>

          <div className="modal-field-group">
            <label className="modal-field-label">Company Name</label>
            <input
              type="text"
              placeholder="Ex: HubSpot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-field-input"
              required
            />
          </div>

          <div className="modal-field-group">
            <label className="modal-field-label">Website Link</label>
            <input
              type="text"
              placeholder="https://company.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="modal-field-input"
              required
            />
          </div>

           <div className="modal-field-group">
            <label className="modal-field-label">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="modal-field-select"
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="modal-field-group">
            <label className="modal-field-label">LinkedIn</label>
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="modal-field-input"
            />
          </div>

          <div className="modal-field-group">
            <label className="modal-field-label">Instagram</label>
            <input
              type="text"
              placeholder="Instagram URL"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="modal-field-input"
            />
          </div>

          <div className="modal-field-group">
            <label className="modal-field-label">Twitter / X</label>
            <input
              type="text"
              placeholder="Twitter URL"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="modal-field-input"
            />
          </div>

          {/* Action Row */}
          <div className="action-button-group">
            <button type="button" onClick={onClose} className="btn-secondary-dismiss">
              Cancel
            </button>
            <button type="submit" className="btn-primary-accent">
              Start Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}