import ProductImage from './ProductImage.jsx';
import StarRating from './StarRating.jsx';
import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product, quantityInCart, onAddToCart }) {
  const inCart = quantityInCart > 0;

  return (
    <article className="card">
      <div className="card-media">
        <ProductImage product={product} />
        <span className="card-badge">{product.category}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={product.name}>{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="card-footer">
          <p className="card-price">{formatPrice(product.price)}</p>
          <button
            type="button"
            className={`btn-cart ${inCart ? 'is-added' : ''}`}
            onClick={() => onAddToCart(product.id)}
            aria-label={`Add ${product.name} to cart`}
          >
            {inCart ? `✓ Added (${quantityInCart})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
