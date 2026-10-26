/*
 * Edge refraction for CSS glass.
 *
 * mountRefraction(el, backdrop?) -> cleanup function, or null when skipped.
 *
 * With a backdrop (the element the glass sits over), every browser: a copy of the backdrop is
 * placed inside the glass, lined up with the original, and bent by an SVG filter on the copy.
 * Firefox and Safari support SVG filters on `filter`; only `backdrop-filter: url()` is
 * Chromium-only. Adds .has-lens.
 * Without one, Chromium only: the filter goes on backdrop-filter instead. Adds .is-refracting.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_MAP = 600; // longest side of the generated map, px
let uid = 0;

const media = (q) => window.matchMedia?.(q).matches;
const radiusPx = (value, width) => (value?.endsWith('%') ? (parseFloat(value) / 100) * width : parseFloat(value) || 0);

// Edge normal in R/G around 128, strongest at the edge, zero from `band` inward.
function displacementMap(w, h, r, bandPx) {
  const f = Math.min(1, MAX_MAP / Math.max(w, h));
  const mw = Math.max(1, Math.round(w * f));
  const mh = Math.max(1, Math.round(h * f));
  const rr = r * f;
  const band = bandPx * f;
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
      const s = 1 - Math.sqrt(1 - t * t); // convex lens: flat in the middle, bending hard at the rim
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

const COPIED = ['font', 'color', 'lineHeight', 'letterSpacing', 'wordSpacing', 'whiteSpace', 'textTransform', 'textAlign', 'fontVariantNumeric'];

// The copy of the backdrop that the lens bends: same element, minus any glass on it.
function makeCopy(backdrop) {
  const copy = backdrop.cloneNode(true);
  copy.querySelectorAll('.glass, [id]').forEach((n) => (n.classList.contains('glass') ? n.remove() : n.removeAttribute('id')));
  copy.removeAttribute('id');
  copy.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
  copy.classList.add('glass__copy');
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  const cs = getComputedStyle(backdrop); // text inside the glass is styled differently, so carry the backdrop's own
  for (const k of COPIED) copy.style[k] = cs[k];
  return copy;
}

export function mountRefraction(el, backdrop) {
  const chromium = navigator.userAgentData?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
  if (!el || (!backdrop && !chromium)) return null;
  if (media('(prefers-contrast: more)') || media('(prefers-reduced-transparency: reduce)')) return null;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const map = document.createElementNS(SVG_NS, 'feImage');
  map.setAttribute('preserveAspectRatio', 'none');
  map.setAttribute('result', 'map');
  filter.append(map);
  // Three bends, one per colour channel, so red and blue split slightly at the rim (iOS 27's
  // fringe). Negative scale samples inward, so the art behind is magnified towards the edge.
  const disps = [];
  const channels = [['r', 1.08, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'], ['g', 1, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'], ['b', 0.92, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0']];
  for (const [c, k, matrix] of channels) {
    const disp = document.createElementNS(SVG_NS, 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'map');
    disp.dataset.k = String(k);
    disps.push(disp);
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');
    disp.setAttribute('result', `d${c}`);
    const pick = document.createElementNS(SVG_NS, 'feColorMatrix');
    pick.setAttribute('in', `d${c}`);
    pick.setAttribute('values', matrix);
    pick.setAttribute('result', c);
    filter.append(disp, pick);
  }
  for (const [a, b, out] of [['r', 'g', 'rg'], ['rg', 'b', 'rgb']]) {
    const add = document.createElementNS(SVG_NS, 'feComposite');
    add.setAttribute('in', a);
    add.setAttribute('in2', b);
    add.setAttribute('operator', 'arithmetic');
    add.setAttribute('k2', '1');
    add.setAttribute('k3', '1');
    add.setAttribute('result', out);
    filter.append(add);
  }
  svg.append(filter);
  document.body.append(svg);

  let lens = null;
  let copy = null;
  if (backdrop) {
    lens = document.createElement('div');
    lens.className = 'glass__lens';
    lens.setAttribute('aria-hidden', 'true');
    copy = makeCopy(backdrop);
    lens.append(copy);
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.prepend(lens);
  } else {
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
  }

  let key = '';
  let timer = 0;
  function update() {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const r = Math.min(radiusPx(getComputedStyle(el).borderTopLeftRadius, w), w / 2, h / 2);
    let ox = 0;
    let oy = 0;
    if (backdrop) {
      const g = el.getBoundingClientRect();
      const b = backdrop.getBoundingClientRect();
      ox = Math.round(g.left - b.left);
      oy = Math.round(g.top - b.top);
      Object.assign(copy.style, { left: `${-ox}px`, top: `${-oy}px`, width: `${backdrop.offsetWidth}px`, height: `${backdrop.offsetHeight}px` });
    }
    const next = `${w}x${h}r${r}@${ox},${oy}`;
    if (next === key) return;
    key = next;
    // The lens rim matches the plates (DECISIONS): 20% of the short side, 14 to 48px, and the art
    // bends up to 1.1x the rim's width at the edge (displacement is scale / 2 at full strength).
    const band = Math.min(Math.max(0.2 * Math.min(w, h), 14), 48, Math.min(w, h) / 2);
    disps.forEach((d) => d.setAttribute('scale', String(-2.2 * band * Number(d.dataset.k))));
    // On the copy, the filter works in the copy's own space: only the glass's patch of it is bent.
    for (const [n, v] of [['x', ox], ['y', oy], ['width', w], ['height', h]]) {
      map.setAttribute(n, String(v));
      if (backdrop) filter.setAttribute(n, String(v));
    }
    if (backdrop) filter.setAttribute('filterUnits', 'userSpaceOnUse');
    map.setAttribute('href', displacementMap(w, h, r, band));
    // A fresh id on every change: Safari caches a filter's output by its id.
    filter.id = `cs-refract-${++uid}`;
    el.style.setProperty('--refract', `url(#${filter.id})`);
    el.classList.add(backdrop ? 'has-lens' : 'is-refracting');
  }
  update();
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(update, 150);
  });
  ro.observe(el);
  if (backdrop) ro.observe(backdrop);

  return () => {
    clearTimeout(timer);
    ro.disconnect();
    el.classList.remove('is-refracting', 'has-lens');
    lens?.remove();
    el.style.removeProperty('--refract');
    svg.remove();
  };
}
