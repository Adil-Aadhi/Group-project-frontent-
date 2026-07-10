import React, { useState, useEffect } from "react";
import { Zap, Plus, Loader2 } from "lucide-react";
import CompetitorCard from "../../components/competitors/CompetitorCard";
import QuickScanModal from "../../components/competitors/QuickScanModal";
import AddCompetitorModal from "../../components/competitors/AddCompetitorModal";
import SearchResultList from "../../components/competitors/SearchResultList";
import { competitorService } from "../../services/competitor/competitorService";
import "../../components/competitors/Competitors.css";
import { useProgressStore } from "../../store/progressStore";
import { useAuthStore } from "../../store/authStore";

export default function CompetitorsPage() {
  const [trackedCompetitors, setTrackedCompetitors] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { startJob } = useProgressStore();

  const { slug } = useAuthStore()

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
    setIsAddModalOpen(false);
    setIsActionLoading(true);
    try {
      const updatedList = await competitorService.addManualCompetitor(newCompetitorData);
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



  const handleAnalyze = async (competitor) => {
    try {
      setIsActionLoading(true);

      const response = await competitorService.startAnalysis(competitor);

      console.log("Analysis started:", response);

      startJob({
        companyId: `company_${slug}`,
        companyName: response.company_name,
        type: "competitor",
      });

      // Next we'll navigate to progress page
    } catch (err) {
      console.error("Failed to start analysis", err);
    } finally {
      setIsActionLoading(false);
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
    <div className="w-full bg-transparent overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1600px] px-10 lg:px-12 xl:px-16 pt-10 pb-12">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

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
          <div className="flex items-center gap-4 shrink-0">


            <button
              onClick={() => setIsScanModalOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-orange-300 bg-white px-6 text-[15px] font-semibold text-orange-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-50 hover:shadow-md"
            >
              <Zap size={17} fill="currentColor" />
              Quick Scan
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-2xl bg-orange-600 px-7 text-[15px] font-semibold text-white shadow-xl shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-700">
              <Plus size={18} />
              Add Competitor
            </button>

          </div>

        </div>

        {/* ================= DIVIDER ================= */}

        <div className="my-8 " />

        {/* ================= FILTER BAR ================= */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="inline-flex items-center rounded-3xl bg-slate-100 p-2.5 py-3.5 gap-2 shadow-sm">

            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-4 rounded-2xl px-8 py-3.5 text-[17px] font-semibold transition ${activeTab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              All

              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${activeTab === "all"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
                  }`}
              >
                {trackedCompetitors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("manual")}
              className={`flex items-center gap-3 rounded-2xl px-7 py-3 text-[17px] font-semibold transition ${activeTab === "manual"
                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Manual

              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${activeTab === "manual"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
                  }`}
              >
                {manualCompetitors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("discovered")}
              className={`flex items-center gap-3 rounded-2xl px-7 py-3 text-[17px] font-semibold transition ${activeTab === "discovered"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Auto-discovered

              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${activeTab === "discovered"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-200 text-slate-600"
                  }`}
              >
                {autoCompetitors.length}
              </span>
            </button>

          </div>

          <p className="text-xs font-semibold text-slate-400">
            {scanResults.length > 0
              ? `${scanResults.length} results`
              : `${displayCompetitors.length} results`}
          </p>

        </div>

        {/* ================= AI SEARCH RESULTS ================= */}

        {scanResults.length > 0 && (
          <div className="mb-8">
            <SearchResultList
              scanResults={scanResults}
              onConfirmTracking={async (selected) => {
                try {
                  setIsActionLoading(true);

                  await competitorService.trackSelectedCompetitors(selected);

                  await fetchWorkspaceCompetitors();

                  setScanResults([]);
                } catch (err) {
                  console.error("Failed to track competitors", err);
                } finally {
                  setIsActionLoading(false);
                }
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
                onAnalyze={handleAnalyze}
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