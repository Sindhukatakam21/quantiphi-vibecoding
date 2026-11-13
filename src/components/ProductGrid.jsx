import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, cart, onAddToCart }) {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          quantityInCart={cart[p.id] || 0}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
