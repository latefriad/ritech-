import { filterButtons } from "../../data/products";

export default function FiltersBar({
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
}) {
  return (
    <div className="filters-bar">
      <div className="filter-btns">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            className={`filter-btn ${activeFilter === btn.key ? "active" : ""}`}
            onClick={() => onFilterChange(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <select
        className="sort-select"
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">ترتيب افتراضي</option>
        <option value="price-asc">السعر: الأقل أولاً</option>
        <option value="price-desc">السعر: الأعلى أولاً</option>
        <option value="sale">العروض أولاً</option>
      </select>
    </div>
  );
}
