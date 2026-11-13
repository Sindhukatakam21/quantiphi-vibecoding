import { useEffect } from 'react';
import ProductImage from './ProductImage.jsx';
import { formatPrice } from '../utils/format.js';
import { MAX_QTY } from '../logic/cartLogic.js';

export default function CartDrawer({
  open,
  items,
  totals,
  onClose,
  onSetQuantity,
  onRemove,
  onClear,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`backdrop ${open ? 'show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        className={`cart-drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <div className="drawer-head">
          <h2>Your cart <span className="muted">({totals.count})</span></h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon" aria-hidden="true">🛒</div>
            <p><strong>Your cart is empty</strong></p>
            <p className="muted">Add something you like and it will show up here.</p>
            <button type="button" className="btn-primary" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="cart-item">
                  <ProductImage product={product} className="cart-thumb" />
                  <div className="cart-info">
                    <p className="cart-name">{product.name}</p>
                    <p className="muted cart-unit">{formatPrice(product.price)} each</p>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => onSetQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >−</button>
                      <span aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => onSetQuantity(product.id, quantity + 1)}
                        disabled={quantity >= MAX_QTY}
                        aria-label={`Increase quantity of ${product.name}`}
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-line">
                    <strong>{formatPrice(lineTotal)}</strong>
                    <button
                      type="button"
                      className="link-btn danger"
                      onClick={() => onRemove(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                    >Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong data-testid="cart-subtotal">{formatPrice(totals.subtotal)}</strong>
              </div>
              <button type="button" className="btn-primary block" onClick={onClose}>Continue shopping</button>
              <button type="button" className="link-btn" onClick={onClear}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
