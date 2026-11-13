import { formatPrice } from '../utils/format.js';

const STEP = 50;

// Dual-handle slider built from two overlapping native range inputs.
// The handles can never cross: each one is clamped against the other.
export default function PriceRangeSlider({ bounds, value, onChange }) {
  const [minVal, maxVal] = value;
  const span = bounds.max - bounds.min || 1;

  const left = ((minVal - bounds.min) / span) * 100;
  const right = ((maxVal - bounds.min) / span) * 100;

  const handleMin = (e) => {
    const next = Math.min(Number(e.target.value), maxVal - STEP);
    onChange([Math.max(next, bounds.min), maxVal]);
  };

  const handleMax = (e) => {
    const next = Math.max(Number(e.target.value), minVal + STEP);
    onChange([minVal, Math.min(next, bounds.max)]);
  };

  // When both handles are bunched at the far right, keep the min handle on top
  // so it can still be dragged back down.
  const minOnTop = minVal > bounds.min + span * 0.9;

  return (
    <div className="price-slider">
      <div className="price-values">
        <span className="price-pill">{formatPrice(minVal)}</span>
        <span className="price-dash">–</span>
        <span className="price-pill">{formatPrice(maxVal)}</span>
      </div>

      <div className="dual-slider">
        <div className="slider-track" />
        <div className="slider-fill" style={{ left: `${left}%`, width: `${right - left}%` }} />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={minVal}
          onChange={handleMin}
          aria-label="Minimum price"
          style={{ zIndex: minOnTop ? 4 : 3 }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={maxVal}
          onChange={handleMax}
          aria-label="Maximum price"
          style={{ zIndex: 3 }}
        />
      </div>

      <div className="slider-limits">
        <span>{formatPrice(bounds.min)}</span>
        <span>{formatPrice(bounds.max)}</span>
      </div>
    </div>
  );
}
