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
      onClick={() => onToggle(company.name)}
    >
      {/* Company Details */}
      <div className="search-result-card__content">
        <h4 className="search-result-card__title">
          {company.name}
        </h4>

        <p className="search-result-card__website">
          {company.website}
        </p>

        <span className="search-result-card__category">
          {company.category}
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