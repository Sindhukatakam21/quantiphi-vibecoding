import { useMemo, useState, useCallback } from 'react';
import products from './data/products.js';
import {
  SORT_OPTIONS,
  getPriceBounds,
  getCategories,
  createDefaultFilters,
  getVisibleProducts,
  hasActiveFilters,
} from './logic/productLogic.js';
import FilterSidebar from './components/FilterSidebar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import EmptyState from './components/EmptyState.jsx';
import SortDropdown from './components/SortDropdown.jsx';

// Derived once from the dataset (module scope: the data never changes).
const BOUNDS = getPriceBounds(products);
const CATEGORIES = getCategories(products);
const CATEGORY_COUNTS = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

export default function App() {
  const [filters, setFilters] = useState(() => createDefaultFilters(BOUNDS));
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEFAULT);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer only

  // Filter the ORIGINAL dataset first, then sort the filtered results.
  const visibleProducts = useMemo(
    () => getVisibleProducts(products, filters, sortBy),
    [filters, sortBy]
  );

  const isDirty = hasActiveFilters(filters, BOUNDS);

  const toggleCategory = useCallback((cat) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }, []);

  const setPriceRange = useCallback((priceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  const setMinRating = useCallback((minRating) => {
    setFilters((prev) => ({ ...prev, minRating }));
  }, []);

  // Reset restores filters only; the chosen sort order is a display preference.
  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters(BOUNDS));
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-name">ShopHub</span>
          </div>
          <span className="topbar-tag">Marketplace</span>
        </div>
      </header>

      <div className="layout">
        <button
          type="button"
          className="filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="filter-panel"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? 'Hide filters' : 'Show filters'}
          {isDirty && <span className="dot" aria-label="filters active" />}
        </button>

        <div id="filter-panel" className={`sidebar-wrap ${filtersOpen ? 'open' : ''}`}>
          <FilterSidebar
            categories={CATEGORIES}
            counts={CATEGORY_COUNTS}
            bounds={BOUNDS}
            filters={filters}
            isDirty={isDirty}
            onToggleCategory={toggleCategory}
            onPriceChange={setPriceRange}
            onRatingChange={setMinRating}
            onReset={resetFilters}
          />
        </div>

        <main className="content">
          <div className="toolbar">
            <p className="result-count" aria-live="polite">
              <strong>{visibleProducts.length}</strong>{' '}
              {visibleProducts.length === 1 ? 'product' : 'products'} found
              {visibleProducts.length !== products.length && (
                <span className="muted"> of {products.length}</span>
              )}
            </p>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {visibleProducts.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <ProductGrid products={visibleProducts} />
          )}
        </main>
      </div>
    </div>
  );
}
