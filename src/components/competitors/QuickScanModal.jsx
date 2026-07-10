import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function QuickScanModal({ isOpen, onClose, onStartScan }) {
  const [industry, setIndustry] = useState("E-commerce / Retail");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");

  if (!isOpen) return null;

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
          <div className="flex items-center gap-2">
            <span className="text-orange-500">
              <Sparkles size={24} fill="currentColor" />
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Quick AI Scan</h2>
          </div>
          <p className="text-sm text-slate-400">
            Find regional competitors matching your operational market space automatically.
          </p>
        </div>

        {/* Interactive Form */}
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            // Fall back to default region values if inputs were submitted completely blank
         onStartScan({
            industry,
            country: "India",
            state: stateName.trim() || "Kerala",
            district: district.trim() || "Kozhikode",
          });
          }}
        >
          {/* Industry Selection Field */}
          <div className="modal-field-group">
            <label className="modal-field-label">Industry</label>
            <select 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)} 
              className="modal-field-select"
            >
              <option value="Software Development">Software Development</option>
              <option value="Information Technology">Information Technology</option>
              <option value="IT Services">IT Services</option>
              <option value="Software Training Institutes">Software Training Institutes</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="FinTech">FinTech</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="E-commerce">E-commerce</option>

            </select>
          </div>

          {/* District Input Field with Low Opacity Placeholder */}
          <div className="modal-field-group">
            <label className="modal-field-label">District</label>
            <input 
              type="text"
              value={district} 
              onChange={(e) => setDistrict(e.target.value)} 
              placeholder="Kozhikode"
              className="modal-field-input placeholder:text-slate-400/60"
            />
          </div>

          {/* State Input Field with Low Opacity Placeholder */}
          <div className="modal-field-group">
            <label className="modal-field-label">State</label>
            <input 
              type="text"
              value={stateName} 
              onChange={(e) => setStateName(e.target.value)} 
              placeholder="Kerala"
              className="modal-field-input placeholder:text-slate-400/60"
            />
          </div>

          {/* Action Buttons Group */}
          <div className="action-button-group">
            <button type="button" onClick={onClose} className="btn-secondary-dismiss">
              Cancel
            </button>
            <button type="submit" className="btn-primary-accent">
              Scan Companies
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}