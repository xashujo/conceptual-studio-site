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
// bandPx widens the bent rim (the lens); by default it follows the corner radius.
function displacementMap(w, h, r, bandPx) {
  const f = Math.min(1, MAX_MAP / Math.max(w, h));
  const mw = Math.max(1, Math.round(w * f));
  const mh = Math.max(1, Math.round(h * f));
  const rr = r * f;
  const band = Math.min(bandPx ? bandPx * f : Math.max(rr, 16 * f), Math.min(mw, mh) / 2);
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

// opts.lens: the iOS-style lens (a wide bent rim with red and blue split apart, the
// style in components.css .is-lens). Without it, the edge bend used since 69b19e3.
export function mountRefraction(el, opts = {}) {
  const { lens = false } = opts;
  const scale = opts.scale ?? (lens ? -48 : -70); // the lens rim is wider, so it needs less push to bend cleanly
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
  // One displacement per channel. With the lens, red bends most and blue least, so the
  // rim splits colour the way a real lens edge does; then the three are added back up.
  const bend = (k, result) => {
    const d = document.createElementNS(SVG_NS, 'feDisplacementMap');
    d.setAttribute('in', 'SourceGraphic');
    d.setAttribute('in2', 'map');
    d.setAttribute('scale', String(scale * k)); // -70: stronger bend to match the plates (Josh, 26 Oct)
    d.setAttribute('xChannelSelector', 'R');
    d.setAttribute('yChannelSelector', 'G');
    if (result) d.setAttribute('result', result);
    return d;
  };
  const keep = (input, row, result) => {
    const m = document.createElementNS(SVG_NS, 'feColorMatrix');
    m.setAttribute('in', input);
    m.setAttribute('type', 'matrix');
    m.setAttribute('values', ['0 0 0 0 0', '0 0 0 0 0', '0 0 0 0 0'].map((z, i) => (i === row ? ['1 0 0 0 0', '0 1 0 0 0', '0 0 1 0 0'][i] : z)).join(' ') + ' 0 0 0 1 0');
    m.setAttribute('result', result);
    return m;
  };
  const add = (a, b, result) => {
    const c = document.createElementNS(SVG_NS, 'feComposite');
    c.setAttribute('in', a);
    c.setAttribute('in2', b);
    c.setAttribute('operator', 'arithmetic');
    c.setAttribute('k2', '1');
    c.setAttribute('k3', '1');
    if (result) c.setAttribute('result', result);
    return c;
  };
  // Red bends more and blue less than green: chromatic aberration at the rim. The split is set per size in update().
  const red = bend(1, 'dr');
  const blue = bend(1, 'db');
  if (lens) {
    filter.append(map,
      red, keep('dr', 0, 'r'),
      bend(1, 'dg'), keep('dg', 1, 'g'),
      blue, keep('db', 2, 'b'),
      add('r', 'g', 'rg'), add('rg', 'b'));
  } else filter.append(map, bend(1));
  svg.append(filter);
  document.body.append(svg);

  let key = '';
  let timer = 0;
  function update() {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const r = Math.min(radiusPx(getComputedStyle(el).borderTopLeftRadius, w), w / 2, h / 2);
    // Lens rim: 30% of the short side, 14 to 40px. The cap keeps big plates' fringe a rim, not a rainbow band (Josh, 28 Oct).
    const band = lens ? Math.min(40, Math.max(14, Math.min(w, h) * 0.3)) : 0;
    const next = `${w}x${h}r${r}`;
    if (next === key) return;
    key = next;
    map.setAttribute('width', String(w));
    map.setAttribute('height', String(h));
    map.setAttribute('href', displacementMap(w, h, r, band));
    el.style.setProperty('--refract', `url(#${id})`);
    if (lens) {
      // 22% split on buttons, pills and bars; 10% on big plates, where 22% read as a rainbow band (Josh, 28 Oct).
      const split = Math.min(w, h) > 120 ? 0.1 : 0.22;
      red.setAttribute('scale', String(scale * (1 + split)));
      blue.setAttribute('scale', String(scale * (1 - split)));
      el.style.setProperty('--lens-band', `${band}px`);
    }
    el.classList.add(lens ? 'is-lens' : 'is-refracting');
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
    el.classList.remove('is-refracting', 'is-lens');
    el.style.removeProperty('--refract');
    svg.remove();
  };
}
