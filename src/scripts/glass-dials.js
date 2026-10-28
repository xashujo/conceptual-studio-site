// Josh's glass dials (Pages CMS, Site settings > Glass), set on <html> as CSS variables.
// 1 = as designed. The /glass/ page changes them live and fires 'glass-dials'.
export function dial(name) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--g-${name}`));
  return Number.isFinite(v) && v >= 0 ? v : 1;
}
export const onDialChange = (fn) => window.addEventListener('glass-dials', fn);
