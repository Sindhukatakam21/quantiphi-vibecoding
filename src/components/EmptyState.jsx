export default function EmptyState({ onReset }) {
  return (
    <div className="empty" role="status">
      <div className="empty-icon" aria-hidden="true">🔍</div>
      <h3>No items match your criteria</h3>
      <p>Try widening the price range, lowering the minimum rating, or selecting more categories.</p>
      <button type="button" className="btn-primary" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}
