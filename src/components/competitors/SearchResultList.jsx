import { useState } from "react";
import SearchResultCard from "./SearchResultCard";

const SearchResultList = ({
  scanResults,
  onConfirmTracking,
  onCancel,
}) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const toggleSelect = (companyName) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyName)
        ? prev.filter((name) => name !== companyName)
        : [...prev, companyName]
    );
  };

  const handleTrackSelected = () => {
    const companies = scanResults.filter((company) =>
      selectedCompanies.includes(company.company_name)
    );

    onConfirmTracking(companies);
  };

  return (
    <section className="search-results">

      {/* Header */}
      <div className="search-results__header">

        <div>
          <h3 className="search-results__title">
            AI Discovery Results
          </h3>

          <p className="search-results__description">
            Select the competitors you want to add to your workspace.
          </p>
        </div>

        <div className="search-results__actions">

          <button
            className="search-results__clear"
            onClick={onCancel}
          >
            Clear
          </button>

          <button
            className="search-results__track"
            disabled={selectedCompanies.length === 0}
            onClick={handleTrackSelected}
          >
            Track Selected ({selectedCompanies.length})
          </button>

        </div>

      </div>

      {/* Cards */}
      <div className="search-results__grid">

        {scanResults.map((company) => (
          <SearchResultCard
            key={company.company_name}
            company={company}
            selected={selectedCompanies.includes(company.company_name)}
            onToggle={toggleSelect}
          />
        ))}

      </div>

    </section>
  );
};

export default SearchResultList;