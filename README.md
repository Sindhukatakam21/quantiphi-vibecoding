# ShopHub – E-Commerce Product Multi-Filter Sidebar

A responsive product browser built with **React + Vite** (plain JavaScript, plain CSS).
Filter by category, price range and minimum rating at the same time, then sort the results.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # logic unit tests (node:test) + UI interaction tests (Vitest)
npm run build      # production build into dist/
```

Requires Node 18+.

## Features

- Sticky left sidebar with: category checklist, dual-handle price slider, minimum-rating radio buttons (1–5 stars)
- Product cards with a real photo, name, category badge, star rating, price and a working **Add to Cart** button
- Image fallback: if a photo fails to load, a generated product-specific illustration (SVG, offline) is shown instead
- Cart: header badge, slide-in cart drawer with quantity +/-, remove, clear and subtotal (max 10 per item)
- Removable **active filter chips** above the grid, plus "Clear all"
- Instant updates on every change (no Apply/Submit button)
- Empty state: "No items match your criteria" with a working **Reset Filters** button
- Sidebar **Reset all** button (disabled when nothing is filtered)
- **Sort by** dropdown: Default, Price: Low to High, Top Rated First
- Live result count ("12 products found of 26")
- Responsive: 3+ columns on desktop, 3 on tablet, 2 on phones; on screens <= 900px the filters open as an off-canvas drawer with a live "Show N products" button

## Filtering rules

| Filter   | Rule |
|----------|------|
| Category | OR within selected categories; nothing selected = no restriction |
| Price    | `min <= price <= max` (inclusive) |
| Rating   | `rating >= selected stars` (4 stars shows 4.0 and above) |
| Combined | A product must satisfy **all** active filters (AND across filter types) |

## Architecture

```
src/
  data/products.js          26 products, frozen (immutable master inventory)
  logic/productLogic.js     pure functions: filterProducts, sortProducts, getVisibleProducts, ...
  logic/cartLogic.js        pure cart helpers: addToCart, setQuantity, removeFromCart, totals
  utils/fallbackImage.js    generated SVG fallback artwork (category colour + product icon)
  components/               FilterSidebar, PriceRangeSlider, ActiveFilters, ProductGrid, ProductCard,
                            ProductImage, CartDrawer, StarRating, SortDropdown, EmptyState
  App.jsx                   state (useState) + derived list (useMemo)
tests/
  productLogic.test.js      14 unit tests for filter/sort logic
  cartLogic.test.js         8 unit tests for cart logic and fallback images
  App.ui.test.jsx           13 interaction tests (filters, slider, empty state, reset, sort,
                            cart, image fallback, filter chips, mobile filter drawer)
```

Key design decisions:

- **Pipeline order:** `getVisibleProducts` filters the *original* dataset first, then sorts the filtered result.
- **No mutation:** every function returns a new array; the master array is `Object.freeze`d, and a test asserts it is unchanged.
- **Logic is separate from the UI.** All filtering/sorting lives in `src/logic/` as pure functions with no React imports, so it can be moved behind an API without changes.
- **Images:** product photos are keyword-matched URLs (loremflickr.com). To use your own, change the `image` field in `src/data/products.js`; the fallback handles any URL that fails.
- **Derived bounds:** price slider limits and category list are computed from the dataset, never hard-coded.
- **Graceful null handling:** `null`/`undefined`/empty filters return the full inventory.
