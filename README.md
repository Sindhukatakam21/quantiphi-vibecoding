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
- Product grid with image, name, category, price and star rating
- Instant updates on every change (no Apply/Submit button)
- Empty state: "No items match your criteria" with a working **Reset Filters** button
- Sidebar **Reset all** button (disabled when nothing is filtered)
- **Sort by** dropdown: Default, Price: Low to High, Top Rated First
- Live result count ("12 products found of 26")
- Responsive: sidebar collapses behind a "Show filters" toggle on tablets/phones

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
  components/               FilterSidebar, PriceRangeSlider, ProductGrid, ProductCard,
                            StarRating, SortDropdown, EmptyState
  App.jsx                   state (useState) + derived list (useMemo)
tests/
  productLogic.test.js      14 unit tests for the logic
  App.ui.test.jsx           7 interaction tests (filters, slider, empty state, reset, sort)
```

Key design decisions:

- **Pipeline order:** `getVisibleProducts` filters the *original* dataset first, then sorts the filtered result.
- **No mutation:** every function returns a new array; the master array is `Object.freeze`d, and a test asserts it is unchanged.
- **Logic is separate from the UI.** All filtering/sorting lives in `src/logic/` as pure functions with no React imports, so it can be moved behind an API without changes.
- **Derived bounds:** price slider limits and category list are computed from the dataset, never hard-coded.
- **Graceful null handling:** `null`/`undefined`/empty filters return the full inventory.
