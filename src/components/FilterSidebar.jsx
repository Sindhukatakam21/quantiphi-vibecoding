import PriceRangeSlider from './PriceRangeSlider.jsx';

const RATING_OPTIONS = [0, 1, 2, 3, 4, 5];

export default function FilterSidebar({
  categories,
  counts,
  bounds,
  filters,
  isDirty,
  onToggleCategory,
  onPriceChange,
  onRatingChange,
  onReset,
}) {
  return (
    <aside className="sidebar" aria-label="Product filters">
      <div className="sidebar-header">
        <h2>Filters</h2>
        <button type="button" className="link-btn" onClick={onReset} disabled={!isDirty}>
          Reset all
        </button>
      </div>

      <fieldset className="filter-group">
        <legend>Category</legend>
        {categories.map((cat) => (
          <label key={cat} className="check-row">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => onToggleCategory(cat)}
            />
            <span className="check-label">{cat}</span>
            <span className="check-count">{counts[cat]}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price range</legend>
        <PriceRangeSlider bounds={bounds} value={filters.priceRange} onChange={onPriceChange} />
      </fieldset>

      <fieldset className="filter-group">
        <legend>Minimum rating</legend>
        {RATING_OPTIONS.map((r) => (
          <label key={r} className="check-row">
            <input
              type="radio"
              name="min-rating"
              value={r}
              checked={filters.minRating === r}
              onChange={() => onRatingChange(r)}
            />
            {r === 0 ? (
              <span className="check-label">All ratings</span>
            ) : (
              <span className="check-label">
                <span className="stars-inline" aria-hidden="true">
                  {'★'.repeat(r)}
                  <span className="stars-inline-off">{'★'.repeat(5 - r)}</span>
                </span>
                <span className="sr-only">{r} stars</span> &amp; up
              </span>
            )}
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
