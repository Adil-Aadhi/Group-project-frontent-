import React from "react";
import "./CompareCharts.css";

export function OfferingGapChart({ positioningGap, usName = "Us", themName }) {
  if (!positioningGap) return null;

  const theyHave = positioningGap.competitor_has_we_dont?.length || 0;
  const weHave = positioningGap.we_have_competitor_doesnt?.length || 0;
  const overlap = positioningGap.overlap?.length || 0;
  const max = Math.max(theyHave, weHave, 1);

  return (
    <div className="offering-chart">
      <div className="offering-chart-row">
        <span className="offering-chart-label">{usName}</span>
        <div className="offering-chart-track">
          <div
            className="offering-chart-fill offering-chart-fill-us"
            style={{ width: `${(weHave / max) * 100}%` }}
          />
        </div>
        <span className="offering-chart-value">{weHave}</span>
      </div>

      <div className="offering-chart-row">
        <span className="offering-chart-label">{themName}</span>
        <div className="offering-chart-track">
          <div
            className="offering-chart-fill offering-chart-fill-them"
            style={{ width: `${(theyHave / max) * 100}%` }}
          />
        </div>
        <span className="offering-chart-value">{theyHave}</span>
      </div>

      {overlap > 0 && (
        <p className="offering-chart-note">{overlap} shared offering{overlap > 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

export function SocialCoverageChart({ socialGap, usName = "Us", themName }) {
  if (!socialGap) return null;

  const allPlatforms = Array.from(
    new Set([
      ...(socialGap.we_active_on || []),
      ...(socialGap.competitor_active_on || []),
    ])
  );
  const total = allPlatforms.length || 1;

  const usCount = socialGap.we_active_on?.length || 0;
  const themCount = socialGap.competitor_active_on?.length || 0;

  const usPct = Math.round((usCount / total) * 100);
  const themPct = Math.round((themCount / total) * 100);

  return (
    <div className="coverage-chart">
      <div className="coverage-chart-row">
        <span className="coverage-chart-label">{usName}</span>
        <div className="coverage-chart-track">
          <div
            className="coverage-chart-fill coverage-chart-fill-us"
            style={{ width: `${usPct}%` }}
          />
        </div>
        <span className="coverage-chart-value">
          {usCount}/{total}
        </span>
      </div>

      <div className="coverage-chart-row">
        <span className="coverage-chart-label">{themName}</span>
        <div className="coverage-chart-track">
          <div
            className="coverage-chart-fill coverage-chart-fill-them"
            style={{ width: `${themPct}%` }}
          />
        </div>
        <span className="coverage-chart-value">
          {themCount}/{total}
        </span>
      </div>
    </div>
  );
}

export function PriorityDistribution({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const counts = { high: 0, medium: 0, low: 0 };
  recommendations.forEach((r) => {
    if (counts[r.priority] !== undefined) counts[r.priority]++;
  });
  const total = recommendations.length;

  return (
    <div className="priority-dist">
      <div className="priority-dist-bar">
        {["high", "medium", "low"].map((p) =>
          counts[p] > 0 ? (
            <div
              key={p}
              className={`priority-dist-segment priority-dist-${p}`}
              style={{ width: `${(counts[p] / total) * 100}%` }}
              title={`${counts[p]} ${p} priority`}
            />
          ) : null
        )}
      </div>
      <div className="priority-dist-legend">
        {["high", "medium", "low"].map((p) =>
          counts[p] > 0 ? (
            <span key={p} className="priority-dist-legend-item">
              <span className={`priority-dist-dot priority-dist-${p}`} />
              {counts[p]} {p}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}