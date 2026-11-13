import { useMemo, useState, useCallback, useEffect } from 'react';
import products from './data/products.js';
import {
  SORT_OPTIONS,
  getPriceBounds,
  getCategories,
  createDefaultFilters,
  getVisibleProducts,
  hasActiveFilters,
} from './logic/productLogic.js';
import {
  addToCart,
  setQuantity,
  removeFromCart,
  getCartItems,
  getCartTotals,
} from './logic/cartLogic.js';
import FilterSidebar from './components/FilterSidebar.jsx';
import ActiveFilters from './components/ActiveFilters.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import EmptyState from './components/EmptyState.jsx';
import SortDropdown from './components/SortDropdown.jsx';
import CartDrawer from './components/CartDrawer.jsx';

// Derived once from the dataset (module scope: the data never changes).
const BOUNDS = getPriceBounds(products);
const CATEGORIES = getCategories(products);
const CATEGORY_COUNTS = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

const isMobileViewport = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(max-width: 900px)').matches;

export default function App() {
  const [filters, setFilters] = useState(() => createDefaultFilters(BOUNDS));
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEFAULT);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile/tablet drawer only
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  // Filter the ORIGINAL dataset first, then sort the filtered results.
  const visibleProducts = useMemo(
    () => getVisibleProducts(products, filters, sortBy),
    [filters, sortBy]
  );

  const cartItems = useMemo(() => getCartItems(cart, products), [cart]);
  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const isDirty = hasActiveFilters(filters, BOUNDS);

  // Lock page scroll while an overlay is open; close the filter drawer on Escape.
  useEffect(() => {
    const lock = cartOpen || (filtersOpen && isMobileViewport());
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFiltersOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtersOpen]);

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

  const resetPrice = useCallback(() => {
    setFilters((prev) => ({ ...prev, priceRange: [BOUNDS.min, BOUNDS.max] }));
  }, []);

  const setMinRating = useCallback((minRating) => {
    setFilters((prev) => ({ ...prev, minRating }));
  }, []);

  // Reset restores filters only; the chosen sort order is a display preference.
  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters(BOUNDS));
  }, []);

  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const handleAddToCart = useCallback((id) => setCart((c) => addToCart(c, id)), []);
  const handleSetQuantity = useCallback((id, qty) => setCart((c) => setQuantity(c, id, qty)), []);
  const handleRemove = useCallback((id) => setCart((c) => removeFromCart(c, id)), []);
  const handleClearCart = useCallback(() => setCart({}), []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-name">ShopHub</span>
          </div>
          <button
            type="button"
            className="cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${cartTotals.count} items`}
          >
            <span aria-hidden="true">🛒</span>
            <span className="cart-btn-label">Cart</span>
            {cartTotals.count > 0 && (
              <span className="cart-badge" data-testid="cart-count">{cartTotals.count}</span>
            )}
          </button>
        </div>
      </header>

      <div className="layout">
        <div className={`backdrop mobile-only ${filtersOpen ? 'show' : ''}`} onClick={closeFilters} aria-hidden="true" />

        <div id="filter-panel" className={`sidebar-wrap ${filtersOpen ? 'open' : ''}`}>
          <FilterSidebar
            categories={CATEGORIES}
            counts={CATEGORY_COUNTS}
            bounds={BOUNDS}
            filters={filters}
            isDirty={isDirty}
            resultCount={visibleProducts.length}
            onToggleCategory={toggleCategory}
            onPriceChange={setPriceRange}
            onRatingChange={setMinRating}
            onReset={resetFilters}
            onClose={closeFilters}
          />
        </div>

        <main className="content">
          <div className="page-title">
            <h1>All products</h1>
            <p className="muted">Browse the catalogue and narrow it down with the filters.</p>
          </div>

          <div className="toolbar">
            <p className="result-count" aria-live="polite">
              <strong>{visibleProducts.length}</strong>{' '}
              {visibleProducts.length === 1 ? 'product' : 'products'} found
              {visibleProducts.length !== products.length && (
                <span className="muted"> of {products.length}</span>
              )}
            </p>

            <div className="toolbar-actions">
              <button
                type="button"
                className="filters-toggle"
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
                onClick={() => setFiltersOpen(true)}
              >
                <span aria-hidden="true">☰</span> Filters
                {isDirty && <span className="dot" aria-label="filters active" />}
              </button>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            bounds={BOUNDS}
            onToggleCategory={toggleCategory}
            onPriceReset={resetPrice}
            onRatingReset={() => setMinRating(0)}
            onReset={resetFilters}
          />

          {visibleProducts.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <ProductGrid products={visibleProducts} cart={cart} onAddToCart={handleAddToCart} />
          )}
        </main>
      </div>

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        totals={cartTotals}
        onClose={closeCart}
        onSetQuantity={handleSetQuantity}
        onRemove={handleRemove}
        onClear={handleClearCart}
      />
    </div>
  );
}
