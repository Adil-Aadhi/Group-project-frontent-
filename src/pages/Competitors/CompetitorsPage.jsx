import React, { useState, useEffect } from "react";
import { Zap, Plus, Loader2 } from "lucide-react";
import CompetitorCard from "../../components/competitors/CompetitorCard";
import QuickScanModal from "../../components/competitors/QuickScanModal";
import AddCompetitorModal from "../../components/competitors/AddCompetitorModal"; 
import SearchResultList from "../../components/competitors/SearchResultList";
import { competitorService } from "../../services/competitor/competitorService";
import "../../components/competitors/Competitors.css";

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
      setTrackedCompetitors(data || []);
    } catch (err) {
      console.error("Failed to load workspace data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAIScan = async (criteria) => {
    setIsScanModalOpen(false);
    setIsActionLoading(true);
    try {
      const discovered = await competitorService.scanCompetitors(criteria);
      setScanResults(discovered || []); 
    } catch (err) {
      console.error("AI scanning error occurred", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddCompetitorSave = async (newCompetitorData) => {
    setIsAddModalOpen(false);
    setIsActionLoading(true);
    try {
      const updatedList = await competitorService.addManualCompetitor(newCompetitorData);
      setTrackedCompetitors(updatedList || []);
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
  <div className="w-full min-h-screen bg-slate-50/40 overflow-x-hidden">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Competitors
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Tracking{" "}
            <span className="font-semibold text-orange-600">
              {trackedCompetitors.length} competitors
            </span>{" "}
            across your market
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            onClick={() => setIsScanModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
          >
            <Zap size={17} fill="currentColor" />
            Quick Scan
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
          >
            <Plus size={18} />
            Add Competitor
          </button>

        </div>

      </div>

      {/* ================= DIVIDER ================= */}

      <div className="my-8 h-px w-full bg-slate-200" />

      {/* ================= FILTER BAR ================= */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1.5">

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            All

            <span
              className={`rounded-md px-2 py-0.5 text-xs ${
                activeTab === "all"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {trackedCompetitors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "manual"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Manual

            <span
              className={`rounded-md px-2 py-0.5 text-xs ${
                activeTab === "manual"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {manualCompetitors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("discovered")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "discovered"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Auto-discovered

            <span
              className={`rounded-md px-2 py-0.5 text-xs ${
                activeTab === "discovered"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {autoCompetitors.length}
            </span>
          </button>

        </div>

        <p className="text-xs font-semibold text-slate-400">
          {displayCompetitors.length} results
        </p>

      </div>

      {/* ================= AI SEARCH RESULTS ================= */}

      {scanResults.length > 0 && (
        <div className="mb-8">
          <SearchResultList
            scanResults={scanResults}
            onConfirmTracking={(selected) => {
              setTrackedCompetitors((prev) => [...prev, ...selected]);
              setScanResults([]);
            }}
            onCancel={() => setScanResults([])}
          />
        </div>
      )}

      {/* ================= LOADER ================= */}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2
            size={38}
            className="animate-spin text-slate-300"
          />
        </div>
      ) : (

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {displayCompetitors.map((competitor) => (

            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onDelete={handleDeleteTracker}
            />

          ))}

        </div>

      )}

      {/* ================= QUICK SCAN ================= */}

      <QuickScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onStartScan={handleRunAIScan}
      />

      {/* ================= ADD COMPETITOR ================= */}

      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCompetitorSave}
      />

    </div>
  </div>
);
}