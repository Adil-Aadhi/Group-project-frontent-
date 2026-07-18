import React, { useState, useEffect } from "react";
import { Zap, Plus, Loader2 } from "lucide-react";
import CompetitorCard from "../../components/competitors/CompetitorCard";
import QuickScanModal from "../../components/competitors/QuickScanModal";
import AddCompetitorModal from "../../components/competitors/AddCompetitorModal";
import SearchResultList from "../../components/competitors/SearchResultList";
import { competitorService } from "../../services/competitor/competitorService";
import "../../components/competitors/Competitors.css";
import './Competitors.css'

export default function CompetitorsPage() {
  const [trackedCompetitors, setTrackedCompetitors] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");



  useEffect(() => {
    fetchWorkspaceCompetitors();
  }, []);

  const fetchWorkspaceCompetitors = async () => {
    try {
      setIsLoading(true);

      const data = await competitorService.getTrackedCompetitors();



      setTrackedCompetitors(data.competitors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAIScan = async (criteria) => {
    setIsScanModalOpen(false);
    setIsActionLoading(true);
    try {
      const discovered = await competitorService.scanCompetitors(criteria);

      console.log(discovered);

      setScanResults(discovered.competitors || []);
    } catch (err) {
      console.error("AI scanning error occurred", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddCompetitorSave = async (newCompetitorData) => {
    
    console.log("handleAddCompetitorSave called");

    setIsAddModalOpen(false);
    setIsActionLoading(true);
    try {
      const updatedList = await competitorService.addManualCompetitor(newCompetitorData);
      
      console.log("Response:", updatedList);

      setTrackedCompetitors((prev) => [...prev, updatedList]);
    } catch (err) {
      console.error("Manual tracking save failed", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteTracker = async (id) => {
    try {
      setTrackedCompetitors(prev => prev.filter(c => c.id !== id));
      await competitorService.deleteCompetitor(id);
    } catch (err) {
      console.error("Could not remove selected company target", err);
      fetchWorkspaceCompetitors();
    }
  };


  // Filter logic variables matching the tabs
  const manualCompetitors = trackedCompetitors.filter(c => c.source === "manual");
  const autoCompetitors = trackedCompetitors.filter(c => c.source === "auto" || c.source === "discovered");

  const displayCompetitors = trackedCompetitors.filter(c => {
    if (activeTab === "manual") return c.source === "manual";
    if (activeTab === "discovered") return c.source === "auto" || c.source === "discovered";
    return true;
  });

  return (
   <div className="competitors-page">
    <div className="competitors-container">

      {/* Header */}
      <div className="competitors-header">

        <div className="header-content">
          <h1 className="page-title">Competitors</h1>

          <p className="page-subtitle">
            Tracking{" "}
            <span className="highlight-count">
              {trackedCompetitors.length} competitors
            </span>{" "}
            across your market
          </p>
        </div>

        <div className="header-actions">

          <button
            onClick={() => setIsScanModalOpen(true)}
            className="btn btn-outline"
          >
            <Zap size={17} fill="currentColor" />
            Quick Scan
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add Competitor
          </button>

        </div>

      </div>

      <div className="section-divider" />

      {/* Filter */}

      <div className="filter-bar">

        <div className="filter-tabs">

          <button
            onClick={() => setActiveTab("all")}
            className={`tab-button ${
              activeTab === "all" ? "active" : ""
            }`}
          >
            All

            <span
              className={`tab-badge ${
                activeTab === "all" ? "active" : ""
              }`}
            >
              {trackedCompetitors.length}
            </span>

          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`tab-button ${
              activeTab === "manual" ? "active" : ""
            }`}
          >
            Manual

            <span
              className={`tab-badge ${
                activeTab === "manual" ? "active" : ""
              }`}
            >
              {manualCompetitors.length}
            </span>

          </button>

          <button
            onClick={() => setActiveTab("discovered")}
            className={`tab-button ${
              activeTab === "discovered" ? "active" : ""
            }`}
          >
            Auto-discovered

            <span
              className={`tab-badge ${
                activeTab === "discovered" ? "active" : ""
              }`}
            >
              {autoCompetitors.length}
            </span>

          </button>

        </div>

        <p className="result-count">
          {scanResults.length > 0
            ? `${scanResults.length} results`
            : `${displayCompetitors.length} results`}
        </p>

      </div>

      {scanResults.length > 0 && (
        <div className="search-results">
          <SearchResultList
            scanResults={scanResults}
            onConfirmTracking={async (selected) => {
              try {
                setIsActionLoading(true);
                console.log("Selected:", selected);

                const response= await competitorService.trackSelectedCompetitors(selected);
                console.log("Track Response:", response);

                await fetchWorkspaceCompetitors();

                setScanResults([]);
              } catch (err) {
                console.error(err);
              } finally {
                setIsActionLoading(false);
              }
            }}
            onCancel={() => setScanResults([])}
          />
        </div>
      )}

      {isLoading ? (

        <div className="loading-wrapper">
          <Loader2
            size={38}
            className="loading-spinner"
          />
        </div>

      ) : (

        <div className="competitor-grid">

          {displayCompetitors.map((competitor) => (

            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onDelete={handleDeleteTracker}
            />

          ))}

        </div>

      )}

      <QuickScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onStartScan={handleRunAIScan}
      />

      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCompetitorSave}
      />

    </div>
  </div>
    );
}