import { useState } from 'react';
import StarRating from './StarRating.jsx';
import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="card">
      <div className="card-media">
        {imgFailed ? (
          <div className="card-fallback" aria-hidden="true">{product.name.charAt(0)}</div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="card-badge">{product.category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title" title={product.name}>{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <p className="card-price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
