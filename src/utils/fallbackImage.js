// Offline fallback artwork, generated as an SVG data URI so it can never fail
// to load. The colour comes from the category and the icon from keywords in
// the product name (falling back to a category icon, then a generic one).

const THEMES = {
  Electronics:      { from: '#dbeafe', to: '#bfdbfe', icon: '🔌' },
  Apparel:          { from: '#fce7f3', to: '#fbcfe8', icon: '👕' },
  Footwear:         { from: '#ffedd5', to: '#fed7aa', icon: '👟' },
  Accessories:      { from: '#ede9fe', to: '#ddd6fe', icon: '👜' },
  'Home & Kitchen': { from: '#dcfce7', to: '#bbf7d0', icon: '🏠' },
};
const DEFAULT_THEME = { from: '#e2e8f0', to: '#cbd5e1', icon: '🛍️' };

// First match wins, so more specific words come first.
const NAME_ICONS = [
  [/headphone/i, '🎧'], [/\btv\b|television/i, '📺'], [/speaker/i, '🔊'], [/camera/i, '📷'],
  [/smartwatch/i, '⌚'], [/analog watch|wristwatch/i, '⌚'], [/keyboard/i, '⌨️'],
  [/t-shirt|tee\b/i, '👕'], [/jeans|denim/i, '👖'], [/sweatshirt|hoodie/i, '🧥'],
  [/dress/i, '👗'], [/jacket/i, '🧥'], [/shirt/i, '👔'],
  [/oxford|formal.*shoes/i, '👞'], [/boot/i, '🥾'], [/sandal|slide/i, '🩴'],
  [/shoe|sneaker/i, '👟'], [/wallet/i, '👛'], [/sunglass/i, '🕶️'], [/backpack/i, '🎒'],
  [/scarf/i, '🧣'], [/bottle/i, '🥤'], [/air fryer|cookware|pan\b/i, '🍳'], [/plate|dinner/i, '🍽️'],
];

export function getFallbackImage(category, name = '') {
  const theme = THEMES[category] ?? DEFAULT_THEME;
  const byName = NAME_ICONS.find(([re]) => re.test(name));
  const icon = byName ? byName[1] : theme.icon;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${theme.from}"/><stop offset="1" stop-color="${theme.to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="480" height="360" fill="url(#g)"/>` +
    `<text x="240" y="210" font-size="120" text-anchor="middle">${icon}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
