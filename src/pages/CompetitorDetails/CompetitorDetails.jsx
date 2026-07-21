import React, { useEffect, useRef, useState } from "react";
import "./CompetitorDetails.css";
import { useLocation } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import CompanyHeader from "../../components/competitorDetails/CompanyHeader";
import MetricCards from "../../components/competitorDetails/MetricCards";
import AISummary from "../../components/competitorDetails/AISummary";
import CompanyInfo from "../../components/competitorDetails/CompanyInfo";
import SWOTCard from "../../components/competitorDetails/SWOTCard";
import SocialCard from "../../components/competitorDetails/SocialCard";
import TrendChart from "../../components/competitorDetails/TrendChart";
import CompareCard from "../../components/competitorDetails/CompareCard";
import DetailTabs from "../../components/competitorDetails/DetailTabs";
import { Loader2 } from "lucide-react";

import { useCompetitorAnalysis } from "../../hooks/Compitetor/useCompetitorAnalysis";
import { useAuthStore } from "../../store/authStore";
import { getAnalyzedCompetitor } from "../../services/competitor/competitorService";

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// NEW: normalize the raw API response into the shapes your components need
function normalizeResponse(raw) {
  if (!raw) return null;

  const { competitor, analysis, comparison } = raw;

  const company = {
    id: competitor?.id,
    company_name: competitor?.company_name,
    website: competitor?.website_url,
    industry: competitor?.industry || "—",
    location: competitor?.location || "—",
    description: analysis?.summary_text || competitor?.description || "",
    lastChecked: analysis?.updated_at || competitor?.updated_at,
    source: analysis?.source_file || "Manual",
  };

  const socials = {
    facebook: analysis?.facebook,
    instagram: analysis?.instagram,
    linkedin: analysis?.linkedin,
    github: analysis?.github,
    youtube: analysis?.youtube,
  };

  const contact = {
    email: analysis?.email,
    phone: analysis?.phone,
  };

  const swot = {
    positive_themes: analysis?.positive_themes || [],
    negative_themes: analysis?.negative_themes || [],
    services: analysis?.services || [],
    products: analysis?.products || [],
  };

  const metrics = [
    { title: "Total Reviews", value: analysis?.total_reviews ?? 0 },
    {
      title: "Rating Score",
      value: analysis?.rating_score != null ? analysis.rating_score : "N/A",
    },
    { title: "Services Listed", value: swot.services.length },
    {
      title: "Review Source",
      value: analysis?.review_source || "—",
    },
  ];

  return {
    company,
    socials,
    contact,
    swot,
    metrics,
    summary: analysis?.summary_text || "",
    comparison, // currently null in your payload
    hasAnalysis: !!analysis,
  };
}

export default function CompetitorDetails() {
  const { state } = useLocation();
  const competitor = state?.competitor;

  const { analyzeCompetitor } = useCompetitorAnalysis();
  const { slug } = useAuthStore();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting analysis...");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [error, setError] = useState(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const [data, setData] = useState(null); // normalized response
  const [checkingExisting, setCheckingExisting] = useState(true);

  const [wsReconnectKey, setWsReconnectKey] = useState(0);



  // TEMP DEBUG: countdown while we wait for background comparison job
const COMPARISON_WAIT_SECONDS = 180; // 3 min - remove once backend notifies us properly
const [compareCountdown, setCompareCountdown] = useState(null);
const countdownIntervalRef = useRef(null);





  // NEW: which tab is active — "info" or "compare"
  const [activeTab, setActiveTab] = useState("info");

  const hasStarted = useRef(false);

  const runAnalysis = async () => {
    try {
      setError(null);
      const res = await analyzeCompetitor(competitor);
      console.log("startAnalysis response:", res);
    } catch (err) {
      console.error("Failed to start analysis", err.response?.data || err);
      setError("Failed to start analysis");
    }
  };

  const fetchExistingAnalysis = async () => {
    try {
      const raw = await getAnalyzedCompetitor(competitor.id);
      return normalizeResponse(raw);
    } catch (err) {
      console.error("Failed to fetch analyzed competitor", err);
      return null;
    }
  };

  // 1) On landing: check if analysis already exists. If not, kick off analysis.
  useEffect(() => {
    if (!competitor || hasStarted.current) return;
    hasStarted.current = true;

    (async () => {
      setCheckingExisting(true);
      const existing = await fetchExistingAnalysis();

      // treat as "existing" only if analysis is actually present, not just competitor shell
      if (existing?.hasAnalysis) {
        setData(existing);
        setAnalysisDone(true);
        setCheckingExisting(false);
        return;
      }

      setCheckingExisting(false);
      console.log("No existing analysis, starting analysis for:", competitor);
      runAnalysis();
    })();
  }, [competitor]);

  // 2) Track progress via websocket
  useEffect(() => {
    if (!slug) return;

    const companyId = `company_${slug}`;
    let isActive = true;

    console.log("DETAILS WS EFFECT MOUNT");

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/api/v1/ws/progress/${companyId}`
    );

    ws.onopen = () => console.log("WS open:", companyId);
    ws.onclose = (e) => console.log("WS closed:", e.code, e.reason);

    ws.onmessage = (event) => {
      
      if (!isActive) return;
      const msg = JSON.parse(event.data);

      console.log("DETAILS MSG", msg)

      setProgress(msg.progress);
      setStatus(msg.status);

      // if (msg.progress === 100) {
      //   setTimeout(async () => {
      //     if (!isActive) return;
      //     const fresh = await fetchExistingAnalysis();
      //     if (fresh) setData(fresh);
      //     setAnalysisDone(true);
      //     setIsReanalyzing(false);
      //   }, 800);
      // }




      if (msg.progress === 100) {
        // TEMP DEBUG: comparison data isn't ready yet at progress=100,
        // it finishes ~3 min later in the background. Wait before fetching.
        setStatus("Finalizing comparison data...");
        setCompareCountdown(COMPARISON_WAIT_SECONDS);

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          setCompareCountdown((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownIntervalRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setTimeout(async () => {
          if (!isActive) return;
          clearInterval(countdownIntervalRef.current);
          setCompareCountdown(null);

          const fresh = await fetchExistingAnalysis();
          if (fresh) setData(fresh);
          setAnalysisDone(true);
          setIsReanalyzing(false);
        }, COMPARISON_WAIT_SECONDS * 1000);
      }

      if (msg.progress === -1) {
        setStatus("Something went wrong");
        setError("Something went wrong");
        setIsReanalyzing(false);
      }
    };

    ws.onerror = (err) => console.error("WS error on details page", err);

    // return () => {
    //   isActive = false;
    //   if (
    //     ws.readyState === WebSocket.OPEN ||
    //     ws.readyState === WebSocket.CONNECTING
    //   ) {
    //     ws.close();
    //   }
    // };


    return () => {
        isActive = false;
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current); // TEMP DEBUG
        if (
          ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING
        ) {
          ws.close();
        }
      };

      
  }, [slug,wsReconnectKey]);

  const handleReanalyze = () => {
    setWsReconnectKey(prev => prev + 1);
    setIsReanalyzing(true);
    setAnalysisDone(false);
    setProgress(0);
    setStatus("Starting analysis...");
    setError(null);
    setActiveTab("info"); // NEW: reset to Overview when re-analyzing
    runAnalysis();
  };

  if (!competitor) {
    return <div className="competitor-details">No competitor selected.</div>;
  }

  if (checkingExisting) {
    return <div className="loading-wrapper"><Loader2 size={38}
            className="loading-spinner"/></div>;
  }

  if (!analysisDone) {
    const clamped = Math.max(0, Math.min(100, progress));
    const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

    return (
      <div className="competitor-details">
        <div className="analysis-progress-page">
          <div className="progress-ring-wrapper">
            <svg className="progress-ring" width="220" height="220" viewBox="0 0 220 220">
              <circle className="progress-ring-track" cx="110" cy="110" r={RADIUS} strokeWidth="10" fill="none" />
              <circle
                className="progress-ring-fill"
                cx="110" cy="110" r={RADIUS} strokeWidth="10" fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
              />
            </svg>
            <div className="progress-ring-center">
              <span className="progress-ring-company">{competitor.company_name}</span>
              <span className="progress-ring-percent">{clamped}%</span>
            </div>
          </div>
          {/* <p className="analysis-status-text">{status || "Starting..."}</p>
          {error && <p className="analysis-error">{error}</p>} */}


          <p className="analysis-status-text">{status || "Starting..."}</p>
{compareCountdown !== null && (
  // TEMP DEBUG: remove this whole block once backend pushes a real "comparison ready" event
  <p className="analysis-status-text">
    Waiting for comparison data — {Math.floor(compareCountdown / 60)}:
    {String(compareCountdown % 60).padStart(2, "0")} left
  </p>
)}
{error && <p className="analysis-error">{error}</p>}



        </div>
      </div>
    );
  }

  const { company, socials, contact, swot, metrics, summary, comparison } = data || {};

  return (
    <div className="competitor-details">
      <div className="details-top-bar">
        <CompanyHeader company={company}
                        onReanalyze={handleReanalyze}
                        isReanalyzing={isReanalyzing} />
      </div>

      <MetricCards metrics={metrics} />

      {/* NEW: tab switcher between Overview and Comparison */}
      <DetailTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        compareAvailable={!!comparison}
      />

      {activeTab === "info" && (
        <>
          <div className="details-grid">
            <AISummary summary={summary} />
            <CompanyInfo company={company} contact={contact} />
          </div>

          <div className="details-grid">
            <SWOTCard swot={swot} />
            <SocialCard socials={socials} />
          </div>

          <TrendChart />
        </>
      )}

      {activeTab === "compare" && (
        <>
          {comparison ? (
            <CompareCard comparison={comparison} />
          ) : (
            <div className="compare-card">
              <h3 className="card-title">Comparison</h3>
              <p className="compare-card-empty">
                Comparison data isn't available yet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}