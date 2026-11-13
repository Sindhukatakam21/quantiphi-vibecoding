import { test } from 'node:test';
import assert from 'node:assert/strict';
import products from '../src/data/products.js';
import {
  SORT_OPTIONS,
  getPriceBounds,
  getCategories,
  createDefaultFilters,
  filterProducts,
  sortProducts,
  getVisibleProducts,
  hasActiveFilters,
} from '../src/logic/productLogic.js';

const bounds = getPriceBounds(products);
const defaults = createDefaultFilters(bounds);

test('dataset has at least 20 products across several categories', () => {
  assert.ok(products.length >= 20);
  assert.ok(getCategories(products).length >= 4);
});

test('default filters return the full inventory', () => {
  assert.equal(filterProducts(products, defaults).length, products.length);
});

test('null / undefined filters are handled gracefully', () => {
  assert.equal(filterProducts(products, null).length, products.length);
  assert.equal(filterProducts(products, {}).length, products.length);
  assert.equal(
    filterProducts(products, { categories: [], priceRange: null, minRating: null }).length,
    products.length
  );
});

test('category filter uses OR across selected categories', () => {
  const res = filterProducts(products, { ...defaults, categories: ['Electronics', 'Footwear'] });
  assert.ok(res.length > 0);
  assert.ok(res.every((p) => ['Electronics', 'Footwear'].includes(p.category)));
  const expected = products.filter((p) => ['Electronics', 'Footwear'].includes(p.category)).length;
  assert.equal(res.length, expected);
});

test('price filter is inclusive on both bounds', () => {
  const res = filterProducts(products, { ...defaults, priceRange: [1000, 3000] });
  assert.ok(res.length > 0);
  assert.ok(res.every((p) => p.price >= 1000 && p.price <= 3000));
  const exact = filterProducts(products, { ...defaults, priceRange: [599, 599] });
  assert.ok(exact.some((p) => p.price === 599));
});

test('rating filter: 4 stars shows products rated 4 or above', () => {
  const res = filterProducts(products, { ...defaults, minRating: 4 });
  assert.ok(res.length > 0);
  assert.ok(res.every((p) => p.rating >= 4));
  assert.equal(res.length, products.filter((p) => p.rating >= 4).length);
});

test('combined filters satisfy ALL conditions', () => {
  const filters = { categories: ['Apparel', 'Accessories'], priceRange: [500, 2500], minRating: 4 };
  const res = filterProducts(products, filters);
  assert.ok(res.length > 0);
  for (const p of res) {
    assert.ok(filters.categories.includes(p.category));
    assert.ok(p.price >= 500 && p.price <= 2500);
    assert.ok(p.rating >= 4);
  }
});

test('impossible combination yields an empty array', () => {
  const res = filterProducts(products, { categories: ['Electronics'], priceRange: [0, 100], minRating: 5 });
  assert.equal(res.length, 0);
});

test('sort: price low to high', () => {
  const res = sortProducts(products, SORT_OPTIONS.PRICE_ASC);
  for (let i = 1; i < res.length; i++) assert.ok(res[i - 1].price <= res[i].price);
});

test('sort: top rated first', () => {
  const res = sortProducts(products, SORT_OPTIONS.RATING_DESC);
  for (let i = 1; i < res.length; i++) assert.ok(res[i - 1].rating >= res[i].rating);
});

test('sort default keeps original order', () => {
  const res = sortProducts(products, SORT_OPTIONS.DEFAULT);
  assert.deepEqual(res.map((p) => p.id), products.map((p) => p.id));
});

test('pipeline filters first and then sorts the filtered results', () => {
  const filters = { ...defaults, categories: ['Footwear'], minRating: 4 };
  const res = getVisibleProducts(products, filters, SORT_OPTIONS.PRICE_ASC);
  assert.ok(res.every((p) => p.category === 'Footwear' && p.rating >= 4));
  for (let i = 1; i < res.length; i++) assert.ok(res[i - 1].price <= res[i].price);
});

test('original array is never mutated', () => {
  const copy = JSON.parse(JSON.stringify(products));
  getVisibleProducts(products, { ...defaults, minRating: 3 }, SORT_OPTIONS.RATING_DESC);
  getVisibleProducts(products, defaults, SORT_OPTIONS.PRICE_ASC);
  assert.deepEqual(JSON.parse(JSON.stringify(products)), copy);
  assert.ok(Object.isFrozen(products));
});

test('hasActiveFilters detects changes from defaults', () => {
  assert.equal(hasActiveFilters(defaults, bounds), false);
  assert.equal(hasActiveFilters({ ...defaults, minRating: 3 }, bounds), true);
  assert.equal(hasActiveFilters({ ...defaults, categories: ['Apparel'] }, bounds), true);
  assert.equal(hasActiveFilters({ ...defaults, priceRange: [bounds.min + 1, bounds.max] }, bounds), true);
});
