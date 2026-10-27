import { mountRefraction } from './refraction.js';
import { mountLiquidGlass } from './liquid-glass.js';

// Lens glass on one element. Chromium bends the live page (SVG). Firefox and Safari can't, so
// when the element sits wholly over the known painting `image` (above `solid`, the share of the
// image left unfaded), the WebGL glass bends that painting instead. Otherwise the clear CSS
// fallback in components.css stays.
export function mountLens(el, image, solid = 1) {
  if (mountRefraction(el, { lens: true }) || !image) return;
  const a = el.getBoundingClientRect();
  const b = image.getBoundingClientRect();
  if (a.top < b.top || a.bottom > b.top + b.height * solid || a.left < b.left || a.right > b.right) return;
  const night = !!el.closest('.night');
  // Clear like the CSS lens: a whisper of tint and a slight blur (tap spacing 1.5px, about 3px sigma).
  mountLiquidGlass(el, { image, tone: night ? 'dark' : 'light', opacity: night ? 0.25 : 0.1, blur: 1.5 });
}
