/*
 * Live edge refraction for CSS glass (Chromium only: Safari and Firefox do not
 * render SVG filters inside backdrop-filter).
 *
 * mountRefraction(el) -> cleanup function, or null when skipped.
 * Builds a per-element SVG filter (displacement map sized to the element's box
 * and border radius), points --refract at it and adds .is-refracting.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_MAP = 600; // longest side of the generated map, px
let uid = 0;

const media = (q) => window.matchMedia?.(q).matches;
const radiusPx = (value, width) => (value?.endsWith('%') ? (parseFloat(value) / 100) * width : parseFloat(value) || 0);

// Edge normal in R/G around 128, strongest at the edge, zero from `band` inward.
function displacementMap(w, h, r) {
  const f = Math.min(1, MAX_MAP / Math.max(w, h));
  const mw = Math.max(1, Math.round(w * f));
  const mh = Math.max(1, Math.round(h * f));
  const rr = r * f;
  const band = Math.min(Math.max(rr, 16 * f), Math.min(mw, mh) / 2);
  const hx = mw / 2;
  const hy = mh / 2;
  const canvas = document.createElement('canvas');
  canvas.width = mw;
  canvas.height = mh;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(mw, mh);
  const px = img.data;
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const dx = x + 0.5 - hx;
      const dy = y + 0.5 - hy;
      const kx = Math.abs(dx) - (hx - rr);
      const ky = Math.abs(dy) - (hy - rr);
      let nx = 0;
      let ny = 0;
      if (kx > 0 && ky > 0) {
        const l = Math.hypot(kx, ky);
        nx = kx / l;
        ny = ky / l;
      } else if (kx > ky) nx = 1;
      else ny = 1;
      const sdf = Math.hypot(Math.max(kx, 0), Math.max(ky, 0)) + Math.min(Math.max(kx, ky), 0) - rr;
      const t = Math.min(1, Math.max(0, 1 + sdf / band));
      const s = t * t;
      const i = (y * mw + x) * 4;
      px[i] = 128 + Math.sign(dx) * nx * s * 127;
      px[i + 1] = 128 + Math.sign(dy) * ny * s * 127;
      px[i + 2] = 128;
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export function mountRefraction(el) {
  const chromium = navigator.userAgentData?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
  if (!el || !chromium) return null;
  if (media('(prefers-contrast: more)') || media('(prefers-reduced-transparency: reduce)')) return null;

  const id = `cs-refract-${++uid}`;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.id = id;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const map = document.createElementNS(SVG_NS, 'feImage');
  map.setAttribute('x', '0');
  map.setAttribute('y', '0');
  map.setAttribute('preserveAspectRatio', 'none');
  map.setAttribute('result', 'map');
  const disp = document.createElementNS(SVG_NS, 'feDisplacementMap');
  disp.setAttribute('in', 'SourceGraphic');
  disp.setAttribute('in2', 'map');
  disp.setAttribute('scale', '-70'); // stronger bend to match the plates (Josh, 26 Oct)
  disp.setAttribute('xChannelSelector', 'R');
  disp.setAttribute('yChannelSelector', 'G');
  filter.append(map, disp);
  svg.append(filter);
  document.body.append(svg);

  let key = '';
  let timer = 0;
  function update() {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const r = Math.min(radiusPx(getComputedStyle(el).borderTopLeftRadius, w), w / 2, h / 2);
    const next = `${w}x${h}r${r}`;
    if (next === key) return;
    key = next;
    map.setAttribute('width', String(w));
    map.setAttribute('height', String(h));
    map.setAttribute('href', displacementMap(w, h, r));
    el.style.setProperty('--refract', `url(#${id})`);
    el.classList.add('is-refracting');
  }
  update();
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(update, 150);
  });
  ro.observe(el);

  return () => {
    clearTimeout(timer);
    ro.disconnect();
    el.classList.remove('is-refracting');
    el.style.removeProperty('--refract');
    svg.remove();
  };
}
