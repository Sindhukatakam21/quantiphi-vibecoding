// Pure, framework-agnostic business logic for filtering and sorting products.
// Nothing in here touches React or the DOM, and nothing mutates its inputs.

export const SORT_OPTIONS = Object.freeze({
  DEFAULT: 'default',
  PRICE_ASC: 'price-asc',
  RATING_DESC: 'rating-desc',
});

/** Derive the slider bounds from the dataset so they never go out of sync. */
export function getPriceBounds(products) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

/** Unique category names in order of first appearance. */
export function getCategories(products) {
  return [...new Set(products.map((p) => p.category))];
}

/** The "nothing selected" state for the given price bounds. */
export function createDefaultFilters(bounds) {
  return { categories: [], priceRange: [bounds.min, bounds.max], minRating: 0 };
}

/**
 * Combinatorial intersect filter.
 * A product is returned only if it satisfies EVERY active criterion:
 *  - category: OR within the selected categories (empty selection = no restriction)
 *  - price:    min <= price <= max (null/undefined range = no restriction)
 *  - rating:   rating >= minRating (0/null = no restriction)
 * Always returns a NEW array; the input is never modified.
 */
export function filterProducts(products, filters) {
  const { categories, priceRange, minRating } = filters ?? {};

  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const hasPrice = Array.isArray(priceRange) && priceRange.length === 2;
  const hasRating = Number.isFinite(minRating) && minRating > 0;

  // Graceful null handling: no active filters -> full inventory (as a copy).
  if (!hasCategories && !hasPrice && !hasRating) return [...products];

  const [minPrice, maxPrice] = hasPrice ? priceRange : [-Infinity, Infinity];

  return products.filter((product) => {
    if (hasCategories && !categories.includes(product.category)) return false;
    if (hasPrice && (product.price < minPrice || product.price > maxPrice)) return false;
    if (hasRating && product.rating < minRating) return false;
    return true;
  });
}

/**
 * Sort a list for display. Works on a copy, so neither the master
 * inventory nor the filtered list is mutated.
 */
export function sortProducts(products, sortBy = SORT_OPTIONS.DEFAULT) {
  const list = [...products];
  switch (sortBy) {
    case SORT_OPTIONS.PRICE_ASC:
      return list.sort((a, b) => a.price - b.price || b.rating - a.rating);
    case SORT_OPTIONS.RATING_DESC:
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    default:
      return list; // original inventory order
  }
}

/** Pipeline: filter the ORIGINAL dataset first, then sort the result. */
export function getVisibleProducts(products, filters, sortBy) {
  return sortProducts(filterProducts(products, filters), sortBy);
}

/** True when the filters differ from the defaults (used to enable Reset). */
export function hasActiveFilters(filters, bounds) {
  return (
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.priceRange[0] !== bounds.min ||
    filters.priceRange[1] !== bounds.max
  );
}
