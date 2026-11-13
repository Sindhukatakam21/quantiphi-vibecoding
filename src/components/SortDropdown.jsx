import { SORT_OPTIONS } from '../logic/productLogic.js';

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="sort">
      <span>Sort by</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value={SORT_OPTIONS.DEFAULT}>Default</option>
        <option value={SORT_OPTIONS.PRICE_ASC}>Price: Low to High</option>
        <option value={SORT_OPTIONS.RATING_DESC}>Top Rated First</option>
      </select>
    </label>
  );
}
