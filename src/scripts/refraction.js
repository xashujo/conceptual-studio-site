/*
 * Live edge refraction for CSS glass (Chromium only: Safari and Firefox do not
 * render SVG filters inside backdrop-filter).
 *
 * mountRefraction(el) -> cleanup function, or null when skipped.
 * Builds a per-element SVG filter (displacement map sized to the element's box
 * and border radius), points --refract at it and adds .is-refracting.
 */
import { dial, onDialChange } from './glass-dials.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_MAP = 600; // longest side of the generated map, px
let uid = 0;

const media = (q) => window.matchMedia?.(q).matches;
const radiusPx = (value, width) => (value?.endsWith('%') ? (parseFloat(value) / 100) * width : parseFloat(value) || 0);

// Edge normal in R/G around 128, strongest at the edge, zero from `band` inward.
// bandPx widens the bent rim (the lens); by default it follows the corner radius.
function displacementMap(w, h, r, bandPx, up = 0) {
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
      let ox = Math.sign(dx) * nx * s;
      let oy = Math.sign(dy) * ny * s;
      // Reach above 100: a long, soft tail of gentler bend toward the centre, its direction blended
      // between the nearest edges so it swirls round the corners (as liquid-glass.js).
      if (up > 0) {
        const len = Math.min(band * (1 + 5 * up), Math.min(mw, mh) / 2);
        const inside = Math.max(-sdf, 0);
        const tail = (1 - Math.min(1, inside / len)) ** 2 * 0.55 * Math.min(up, 1.5);
        const wx = Math.exp(-Math.max(hx - Math.abs(dx), 0) / Math.max(len * 0.35, 1));
        const wy = Math.exp(-Math.max(hy - Math.abs(dy), 0) / Math.max(len * 0.35, 1));
        const l = Math.hypot(wx, wy) || 1;
        ox += (Math.sign(dx) * wx / l) * tail;
        oy += (Math.sign(dy) * wy / l) * tail;
      }
      const i = (y * mw + x) * 4;
      px[i] = 128 + Math.max(-1, Math.min(1, ox)) * 127;
      px[i + 1] = 128 + Math.max(-1, Math.min(1, oy)) * 127;
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
  const maps = []; // [node, k]: rescaled when the bend dial changes
  const bend = (k, result) => {
    const d = document.createElementNS(SVG_NS, 'feDisplacementMap');
    d.setAttribute('in', 'SourceGraphic');
    d.setAttribute('in2', 'map');
    d.setAttribute('scale', String(scale * k * dial('bend'))); // -70: stronger bend to match the plates (Josh, 26 Oct)
    maps.push([d, k]);
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
  if (lens) {
    filter.append(map,
      bend(1.08, 'dr'), keep('dr', 0, 'r'),
      bend(1, 'dg'), keep('dg', 1, 'g'),
      bend(0.92, 'db'), keep('db', 2, 'b'),
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
    const band = lens ? Math.max(14, Math.min(w, h) * 0.3) : 0; // lens rim: 30% of the short side, 14px minimum
    // Reach (Josh's dial) widens only the bent band, so the drag travels further in; the middle blur keeps --lens-band.
    const reach = lens ? band * Math.min(1, dial('reach')) : 0; // below 100 the bent rim narrows; above it, a soft tail (in the map)
    const up = lens ? Math.max(0, dial('reach') - 1) : 0;
    const next = `${w}x${h}r${r}b${reach}u${up}`;
    if (next === key) return;
    key = next;
    map.setAttribute('width', String(w));
    map.setAttribute('height', String(h));
    map.setAttribute('href', displacementMap(w, h, r, reach, up));
    el.style.setProperty('--refract', `url(#${id})`);
    if (lens) el.style.setProperty('--lens-band', `${band}px`);
    el.classList.add(lens ? 'is-lens' : 'is-refracting');
  }
  update();
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(update, 150);
  });
  ro.observe(el);
  onDialChange(() => {
    maps.forEach(([d, k]) => d.setAttribute('scale', String(scale * k * dial('bend'))));
    update();
  });

  return () => {
    clearTimeout(timer);
    ro.disconnect();
    el.classList.remove('is-refracting', 'is-lens');
    el.style.removeProperty('--refract');
    svg.remove();
  };
}
