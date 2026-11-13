import { formatPrice } from '../utils/format.js';

// Removable chips summarising the active filters, shown above the grid.
export default function ActiveFilters({
  filters,
  bounds,
  onToggleCategory,
  onPriceReset,
  onRatingReset,
  onReset,
}) {
  const priceChanged =
    filters.priceRange[0] !== bounds.min || filters.priceRange[1] !== bounds.max;
  const hasAny = filters.categories.length > 0 || priceChanged || filters.minRating > 0;
  if (!hasAny) return null;

  return (
    <div className="chips" aria-label="Active filters">
      {filters.categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className="chip"
          onClick={() => onToggleCategory(cat)}
          aria-label={`Remove ${cat} filter`}
        >
          {cat} <span aria-hidden="true">✕</span>
        </button>
      ))}
      {priceChanged && (
        <button type="button" className="chip" onClick={onPriceReset} aria-label="Remove price filter">
          {formatPrice(filters.priceRange[0])} – {formatPrice(filters.priceRange[1])}{' '}
          <span aria-hidden="true">✕</span>
        </button>
      )}
      {filters.minRating > 0 && (
        <button type="button" className="chip" onClick={onRatingReset} aria-label="Remove rating filter">
          {filters.minRating}★ &amp; up <span aria-hidden="true">✕</span>
        </button>
      )}
      <button type="button" className="link-btn" onClick={onReset}>Clear all</button>
    </div>
  );
}
