import { useState } from 'react';
import { getFallbackImage } from '../utils/fallbackImage.js';

// Product photo with a shimmering placeholder behind it and a guaranteed
// fallback: if the remote image errors, a generated category illustration is used.
export default function ProductImage({ product, className = '' }) {
  const fallback = getFallbackImage(product.category, product.name);
  const [src, setSrc] = useState(product.image || fallback);

  const handleError = () => {
    if (src !== fallback) setSrc(fallback);
  };

  return (
    <div className={`img-wrap ${className}`}>
      <img
        src={src}
        alt={product.name}
        loading="lazy"
        decoding="async"
        onError={handleError}
        data-fallback={src === fallback ? 'true' : undefined}
      />
    </div>
  );
}
