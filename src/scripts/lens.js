import { mountRefraction } from './refraction.js';
import { mountLiquidGlass } from './liquid-glass.js';

// Lens glass on one element. Chromium bends the live page (SVG). Firefox and Safari can't, so
// when the element sits wholly over the known painting `image`, the WebGL glass bends that
// painting instead, following its mask `fade` ([start, end] shares of its height) into the page.
// Otherwise the clear CSS fallback in components.css stays.
// `held`: the painting is held behind everything the element can scroll over (a sticky field, as on
// the home page), so skip the check that the element sits inside it right now.
//
// Light to render (Josh, 28 Oct: "14 is a lot, drop it to like 3"): at most BENDS pieces bend per page,
// in every browser, and only small chrome (the nav, pills, bars: 72px tall or less), first come first
// served in page order. Everything else is a pane: plain blurred glass, CSS only, no filter or canvas.
const BENDS = 3;
let bends = 0;

// data-bend forces a bend outside the budget: only the /glass/ tuning page uses it, so every piece there previews the bend.
export function mountLens(el, image, fade, held = false) {
  const h = el.offsetHeight;
  if (!el.hasAttribute('data-bend') && (!h || h > 72 || bends >= BENDS)) {
    el.classList.add('is-pane');
    return;
  }
  if (!el.hasAttribute('data-bend')) bends++;
  if (mountRefraction(el, { lens: true }) || !image) return;
  const a = el.getBoundingClientRect();
  const b = image.getBoundingClientRect();
  if (!held && (a.top < b.top || a.bottom > b.bottom || a.left < b.left || a.right > b.right)) return;
  const night = !!el.closest('.night') || el.classList.contains('is-dark');
  // Clear like the CSS lens: a whisper of tint and a slight blur (tap spacing 1.5px, about 3px sigma).
  return mountLiquidGlass(el, { image, tone: night ? 'dark' : 'light', opacity: night ? 0.25 : 0.1, blur: 1.5, fade, lens: true });
}
