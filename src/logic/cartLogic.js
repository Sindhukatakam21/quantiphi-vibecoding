// Pure cart helpers. The cart is a plain map of { [productId]: quantity }.
// Every function returns a new object; inputs are never mutated.

export const MAX_QTY = 10;

export function addToCart(cart, productId) {
  const next = Math.min((cart[productId] || 0) + 1, MAX_QTY);
  return { ...cart, [productId]: next };
}

export function setQuantity(cart, productId, quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) return removeFromCart(cart, productId);
  return { ...cart, [productId]: Math.min(Math.floor(quantity), MAX_QTY) };
}

export function removeFromCart(cart, productId) {
  const { [productId]: _removed, ...rest } = cart;
  return rest;
}

/** Join cart quantities with the product list, ignoring unknown ids. */
export function getCartItems(cart, products) {
  return products
    .filter((p) => cart[p.id] > 0)
    .map((product) => ({
      product,
      quantity: cart[product.id],
      lineTotal: product.price * cart[product.id],
    }));
}

export function getCartTotals(items) {
  return items.reduce(
    (acc, item) => ({
      count: acc.count + item.quantity,
      subtotal: acc.subtotal + item.lineTotal,
    }),
    { count: 0, subtotal: 0 }
  );
}
