// Read-only star display. Supports fractional ratings (e.g. 4.6) by clipping
// a row of filled stars over a row of empty stars.
export default function StarRating({ rating, reviews }) {
  const pct = Math.max(0, Math.min(5, rating)) * 20;

  return (
    <div className="stars-row" aria-label={`Rated ${rating} out of 5`}>
      <span className="stars" aria-hidden="true">
        <span className="stars-empty">★★★★★</span>
        <span className="stars-filled" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <span className="rating-value">{rating.toFixed(1)}</span>
      {reviews != null && <span className="review-count">({reviews.toLocaleString('en-IN')})</span>}
    </div>
  );
}
