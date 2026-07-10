import { Check } from "lucide-react";

const SearchResultCard = ({
  company,
  selected,
  onToggle,
}) => {
  return (
    <div
      className={`search-result-card ${
        selected ? "selected" : ""
      }`}
      onClick={() => onToggle(company.company_name)}
    >
      {/* Company Details */}
      <div className="search-result-card__content">
        <h4 className="search-result-card__title">
          {company.company_name}
        </h4>

        <p className="search-result-card__website">
          {company.website_url}
        </p>

        <span className="search-result-card__category">
          {company.industry}
        </span>
      </div>

      {/* Selection Checkbox */}
      <div
        className={`search-result-card__checkbox ${
          selected ? "checked" : ""
        }`}
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </div>
    </div>
  );
};

export default SearchResultCard;