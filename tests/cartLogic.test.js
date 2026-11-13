import { test } from 'node:test';
import assert from 'node:assert/strict';
import products from '../src/data/products.js';
import {
  MAX_QTY,
  addToCart,
  setQuantity,
  removeFromCart,
  getCartItems,
  getCartTotals,
} from '../src/logic/cartLogic.js';
import { getFallbackImage } from '../src/utils/fallbackImage.js';

test('addToCart increments and caps at MAX_QTY without mutating', () => {
  const empty = Object.freeze({});
  const one = addToCart(empty, 1);
  assert.deepEqual(one, { 1: 1 });
  assert.deepEqual(empty, {});
  let cart = one;
  for (let i = 0; i < 20; i++) cart = addToCart(cart, 1);
  assert.equal(cart[1], MAX_QTY);
});

test('setQuantity updates, removes at <= 0, and ignores invalid values', () => {
  assert.deepEqual(setQuantity({ 1: 2 }, 1, 5), { 1: 5 });
  assert.deepEqual(setQuantity({ 1: 2 }, 1, 0), {});
  assert.deepEqual(setQuantity({ 1: 2 }, 1, NaN), {});
  assert.equal(setQuantity({ 1: 2 }, 1, 99)[1], MAX_QTY);
});

test('removeFromCart removes only the given product', () => {
  assert.deepEqual(removeFromCart({ 1: 2, 2: 1 }, 1), { 2: 1 });
});

test('getCartItems + getCartTotals compute lines and subtotal', () => {
  const cart = { 1: 2, 7: 3, 9999: 4 }; // 9999 is unknown and must be ignored
  const items = getCartItems(cart, products);
  assert.equal(items.length, 2);
  const totals = getCartTotals(items);
  const p1 = products.find((p) => p.id === 1);
  const p7 = products.find((p) => p.id === 7);
  assert.equal(totals.count, 5);
  assert.equal(totals.subtotal, p1.price * 2 + p7.price * 3);
});

test('fallback image is an SVG data URI for every category, including unknown', () => {
  for (const c of ['Electronics', 'Apparel', 'Footwear', 'Accessories', 'Home & Kitchen', 'Mystery']) {
    assert.match(getFallbackImage(c), /^data:image\/svg\+xml/);
  }
});

test('every product has a remote image url', () => {
  assert.ok(products.every((p) => /^https:\/\//.test(p.image)));
});

test('fallback icon is product-specific and differs between products', () => {
  const a = getFallbackImage('Electronics', 'Wireless Noise-Cancelling Headphones');
  const b = getFallbackImage('Electronics', '4K Ultra HD Smart TV 43"');
  const c = getFallbackImage('Electronics', 'Mirrorless Camera Body');
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.ok(decodeURIComponent(a).includes('🎧'));
  assert.ok(decodeURIComponent(c).includes('📷'));
});

test('every product resolves to its own relevant fallback icon (no generic default)', () => {
  const generic = new Set(['🔌', '👕', '👟', '👜', '🏠', '🛍️']);
  const icons = products.map((p) => {
    const m = decodeURIComponent(getFallbackImage(p.category, p.name)).match(/text-anchor="middle">(.*)<\/text>/u);
    return [p.name, m[1]];
  });
  // Every Electronics / Home & Kitchen product must be matched by name, not by category default.
  for (const [name, icon] of icons) {
    const p = products.find((x) => x.name === name);
    if (['Electronics', 'Home & Kitchen'].includes(p.category)) {
      assert.ok(!generic.has(icon), `${name} fell back to a generic icon (${icon})`);
    }
  }
});
