// Tune mode (Josh, 27 Oct): try type, spacing and image changes live on any page, then copy
// them as a list for Claude to build into the code. Nothing here is saved to the site.
// Turn on with ?tune in the address; it stays on across pages until "Turn off" is pressed.
// Changes are kept in this browser (localStorage) per page, so they survive a reload.

const STORE = 'cs-tune-changes';
const FLAG = 'cs-tune';
const NOISE = /^(is-|has-|astro-|swap)/; // classes added at runtime or by the build

const store = {
  get() { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { return []; } },
  set(v) { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* private window */ } },
};
try { localStorage.setItem(FLAG, '1'); } catch { /* fine */ }

const page = location.pathname;
let changes = store.get(); // [{page, sel, label, bp, prop, title, from, to, unit} | {kind:'kern', page, sel, label, bp, index, pair, word, value}]

// ---------- Helpers ----------
const px = (v) => parseFloat(v) || 0;
const round = (v, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
const bp = () => {
  const w = window.innerWidth;
  return `${w < 760 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'} width (${w}px)`;
};

function selector(el) {
  const parts = [];
  for (let n = el; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
    if (n.id && !n.id.startsWith('cs-')) { parts.unshift(`#${CSS.escape(n.id)}`); break; }
    let s = n.tagName.toLowerCase();
    const cls = [...n.classList].find((c) => !NOISE.test(c));
    if (cls) s += `.${CSS.escape(cls)}`;
    const same = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [];
    if (same.length > 1) s += `:nth-of-type(${same.indexOf(n) + 1})`;
    parts.unshift(s);
  }
  return parts.join(' > ');
}
function label(el) {
  const tag = el.tagName.toLowerCase();
  const cls = [...el.classList].find((c) => !NOISE.test(c));
  const text = (el.alt || el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
  const kind = { h1: 'Heading', h2: 'Heading', h3: 'Heading', p: 'Text', a: 'Link', button: 'Button', img: 'Image', li: 'List item', nav: 'Menu bar', section: 'Section', figure: 'Figure', header: 'Header', footer: 'Footer', article: 'Card', ul: 'List', ol: 'List' }[tag] || 'Block';
  return `${kind} (${tag}${cls ? '.' + cls : ''})${text ? ` "${text.length > 48 ? text.slice(0, 47) + '…' : text}"` : ''}`;
}
const hasText = (el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());

// ---------- Controls ----------
// read(el, cs) -> number in the control's unit; write(v) -> CSS value.
const fs = (cs) => px(cs.fontSize) || 16;
const CONTROLS = [
  { group: 'Text', key: 'size', title: 'Size', prop: 'font-size', unit: 'px', min: 8, max: 300, step: 1, show: hasText, read: (el, cs) => px(cs.fontSize), write: (v) => `${v}px` },
  { group: 'Text', key: 'track', title: 'Letter-spacing', prop: 'letter-spacing', unit: '/1000 em', min: -150, max: 200, step: 1, show: hasText, read: (el, cs) => Math.round((cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing) / fs(cs)) * 1000), write: (v) => `${v / 1000}em` },
  { group: 'Text', key: 'lead', title: 'Line height', prop: 'line-height', unit: '× size', min: 0.6, max: 2.4, step: 0.01, show: hasText, read: (el, cs) => (cs.lineHeight === 'normal' ? 1.2 : round(px(cs.lineHeight) / fs(cs), 2)), write: (v) => String(v) },
  { group: 'Text', key: 'weight', title: 'Weight', prop: 'font-weight', unit: '', min: 100, max: 900, step: 10, show: (el, cs) => hasText(el) && !/agatho/i.test(cs.fontFamily.split(',')[0]) /* Agatho has one weight */, read: (el, cs) => px(cs.fontWeight), write: (v) => String(v) },
  { group: 'Text', key: 'measure', title: 'Line length', prop: 'max-width', unit: 'ch', min: 10, max: 140, step: 1, show: hasText, read: (el, cs) => (cs.maxWidth === 'none' ? Math.round(el.getBoundingClientRect().width / (fs(cs) * 0.5)) : Math.round(px(cs.maxWidth) / (fs(cs) * 0.5))), write: (v) => `${v}ch` },
  { group: 'Text', key: 'words', title: 'Word spacing', prop: 'word-spacing', unit: '/1000 em', min: -200, max: 500, step: 5, show: hasText, read: (el, cs) => Math.round((cs.wordSpacing === 'normal' ? 0 : px(cs.wordSpacing) / fs(cs)) * 1000), write: (v) => `${v / 1000}em` },

  { group: 'Spacing', key: 'above', title: 'Space above', prop: 'margin-top', unit: 'px', min: -200, max: 400, step: 1, read: (el, cs) => px(cs.marginTop), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'below', title: 'Space below', prop: 'margin-bottom', unit: 'px', min: -200, max: 400, step: 1, read: (el, cs) => px(cs.marginBottom), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'padx', title: 'Padding, sides', prop: 'padding-inline', unit: 'px', min: 0, max: 300, step: 1, read: (el, cs) => px(cs.paddingLeft), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'pady', title: 'Padding, top and bottom', prop: 'padding-block', unit: 'px', min: 0, max: 300, step: 1, read: (el, cs) => px(cs.paddingTop), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'gap', title: 'Gap between items', prop: 'gap', unit: 'px', min: 0, max: 200, step: 1, show: (el, cs) => /flex|grid/.test(cs.display), read: (el, cs) => px(cs.columnGap === 'normal' ? cs.rowGap : cs.columnGap), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'width', title: 'Width', prop: 'width', unit: 'px', min: 40, max: 2400, step: 1, read: (el) => Math.round(el.getBoundingClientRect().width), write: (v) => `${v}px` },
  { group: 'Spacing', key: 'radius', title: 'Corner radius', prop: 'border-radius', unit: 'px', min: 0, max: 200, step: 1, read: (el, cs) => px(cs.borderTopLeftRadius), write: (v) => `${v}px` },

  { group: 'Image', key: 'fx', title: 'Crop focus, left to right', prop: 'object-position', unit: '%', min: 0, max: 100, step: 1, show: (el) => el.tagName === 'IMG', read: (el, cs) => px(cs.objectPosition.split(' ')[0] || '50'), write: (v, el) => `${v}% ${getComputedStyle(el).objectPosition.split(' ')[1] || '50%'}` },
  { group: 'Image', key: 'fy', title: 'Crop focus, top to bottom', prop: 'object-position', unit: '%', min: 0, max: 100, step: 1, show: (el) => el.tagName === 'IMG', read: (el, cs) => px(cs.objectPosition.split(' ')[1] || '50'), write: (v, el) => `${getComputedStyle(el).objectPosition.split(' ')[0] || '50%'} ${v}%` },
];
const RATIOS = ['auto', '16 / 9', '3 / 2', '4 / 3', '5 / 4', '1 / 1', '4 / 5', '2 / 3'];

// ---------- Applying and recording ----------
function apply(el, prop, value) { el.style.setProperty(prop, value, 'important'); }
function record(el, prop, title, from, to, css) {
  const sel = selector(el);
  const i = changes.findIndex((c) => c.page === page && c.sel === sel && c.prop === prop && c.kind !== 'kern');
  if (i >= 0) changes[i] = { ...changes[i], to, css, bp: bp() };
  else changes.push({ page, sel, label: label(el), bp: bp(), prop, title, from, to, css });
  store.set(changes);
  renderLog();
}

// Kerning: the left letter of the pair is wrapped in a span whose right margin opens or closes the gap.
function charAt(el, index) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n = 0;
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (index < n + t.length) return { node: t, offset: index - n };
    n += t.length;
  }
  return null;
}
function indexOf(el, node, offset) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n = 0;
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (t === node) return n + offset;
    n += t.length;
  }
  return -1;
}
function kernSpan(el, index) {
  const hit = charAt(el, index);
  if (!hit) return null;
  const parent = hit.node.parentElement;
  if (parent?.dataset.csKern !== undefined && hit.node.length === 1) return parent;
  const mid = hit.offset ? hit.node.splitText(hit.offset) : hit.node;
  mid.splitText(1);
  const span = document.createElement('span');
  span.dataset.csKern = '';
  mid.replaceWith(span);
  span.append(mid);
  return span;
}
function setKern(el, index, value) {
  const span = kernSpan(el, index);
  if (span) span.style.marginRight = value ? `${value / 1000}em` : '';
  return span;
}

// Re-apply this page's saved changes on load.
function restore() {
  for (const c of changes.filter((x) => x.page === page)) {
    const el = document.querySelector(c.sel);
    if (!el) continue;
    if (c.kind === 'kern') setKern(el, c.index, c.value);
    else apply(el, c.prop, c.css ?? c.to);
  }
}

function undo(c) {
  const el = page === c.page ? document.querySelector(c.sel) : null;
  if (el) {
    if (c.kind === 'kern') setKern(el, c.index, 0);
    else el.style.removeProperty(c.prop);
  }
  changes = changes.filter((x) => x !== c);
  store.set(changes);
  renderLog();
  if (selected) showControls();
}

function copyText() {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const lines = [`Tune mode changes, ${date}`];
  const pages = [...new Set(changes.map((c) => c.page))];
  for (const p of pages) {
    lines.push('', `Page: ${p}`);
    const bySel = new Map();
    for (const c of changes.filter((x) => x.page === p)) {
      if (!bySel.has(c.sel)) bySel.set(c.sel, []);
      bySel.get(c.sel).push(c);
    }
    let n = 0;
    for (const [sel, list] of bySel) {
      lines.push(`${++n}. ${list[0].label}, at ${list[0].bp}`);
      for (const c of list) {
        lines.push(c.kind === 'kern'
          ? `   Kerning "${c.pair}" in "${c.word}": ${c.value > 0 ? '+' : ''}${c.value}/1000 em`
          : `   ${c.title}: ${c.from} → ${c.to}`);
      }
      lines.push(`   (${sel})`);
    }
  }
  return lines.join('\n');
}

// ---------- Panel (shadow DOM, so the site's styles can't reach it) ----------
const host = document.createElement('div');
host.id = 'cs-tune';
host.style.cssText = 'position:fixed;z-index:2147483646;left:16px;bottom:16px;';
const root = host.attachShadow({ mode: 'open' });
root.innerHTML = `
<style>
  :host { all: initial; }
  * { box-sizing: border-box; }
  .panel { width: 340px; max-height: calc(100vh - 32px); overflow: auto; background: #1b1916; color: #f1dfc8; border-radius: 18px; box-shadow: 0 0 0 1px rgb(241 223 200 / .14), 0 18px 48px -12px rgb(0 0 0 / .6); font: 13px/1.4 Inter, system-ui, sans-serif; padding: 14px; display: grid; gap: 10px; }
  .panel[hidden] { display: none; }
  h2 { margin: 0; font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
  .muted { color: rgb(241 223 200 / .6); font-size: 12px; }
  .row { display: flex; flex-wrap: wrap; gap: 6px; }
  button { font: inherit; color: inherit; background: rgb(241 223 200 / .1); border: 0; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
  button:hover { background: rgb(241 223 200 / .18); }
  button[aria-pressed="true"] { background: #f1dfc8; color: #14110d; }
  button.primary { background: #f1dfc8; color: #14110d; font-weight: 600; }
  .sel { background: rgb(241 223 200 / .06); border-radius: 10px; padding: 8px 10px; word-break: break-word; }
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 8px; }
  legend { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: rgb(241 223 200 / .7); margin-bottom: 4px; }
  label { display: grid; grid-template-columns: 1fr 72px; gap: 2px 8px; align-items: center; }
  label input[type=range] { grid-column: 1 / -1; width: 100%; accent-color: #f1dfc8; margin: 0; }
  label input[type=number], select { width: 72px; font: inherit; color: inherit; background: rgb(241 223 200 / .08); border: 1px solid rgb(241 223 200 / .16); border-radius: 6px; padding: 3px 5px; text-align: right; }
  select { width: auto; text-align: left; }
  .unit { color: rgb(241 223 200 / .55); font-size: 11px; }
  ol { margin: 0; padding-left: 18px; display: grid; gap: 4px; }
  li { word-break: break-word; }
  li button { padding: 1px 8px; margin-left: 4px; font-size: 11px; }
  .kern { background: rgb(241 223 200 / .06); border-radius: 10px; padding: 8px 10px; }
  .fab { position: fixed; left: 16px; bottom: 16px; background: #1b1916; color: #f1dfc8; box-shadow: 0 8px 24px -8px rgb(0 0 0 / .6); }
  .fab[hidden] { display: none; }
</style>
<button class="fab" data-act="open" hidden>Tune</button>
<div class="panel" role="dialog" aria-label="Tune mode">
  <h2>Tune mode <span class="row"><button data-act="side">Move to other side</button><button data-act="hide" aria-label="Hide the panel">Hide</button></span></h2>
  <p class="muted" data-bp></p>
  <div class="row">
    <button data-act="pick" aria-pressed="true">Pick</button>
    <button data-act="parent">Select parent</button>
    <button data-act="kern" aria-pressed="false">Kern letters</button>
  </div>
  <div class="sel muted" data-sel>Click anything on the page to select it.</div>
  <div class="kern muted" data-kern hidden>Click between two letters in the selected text, then use ← and → to close or open the gap. Hold Shift for bigger steps.</div>
  <div data-controls></div>
  <fieldset>
    <legend>Your changes</legend>
    <p class="muted" data-empty>None yet.</p>
    <ol data-log></ol>
  </fieldset>
  <div class="row">
    <button class="primary" data-act="copy">Copy my changes</button>
    <button data-act="clear">Clear all</button>
  </div>
  <div class="row">
    <button data-act="phone">Open at phone size</button>
    <button data-act="tablet">Open at tablet size</button>
    <button data-act="off">Turn off tune mode</button>
  </div>
  <p class="muted">Nothing here changes the real site. Copy your changes and send them to Claude.</p>
</div>`;
document.body.append(host);
const $ = (q) => root.querySelector(q);

// Outline for hover and selection, drawn outside the page's own boxes.
const box = (color) => {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;z-index:2147483645;pointer-events:none;border:2px solid ${color};border-radius:3px;display:none;`;
  document.body.append(d);
  return d;
};
const hoverBox = box('rgb(31 157 85 / .8)');
const selBox = box('#e8590c');
const place = (b, el) => {
  if (!el) { b.style.display = 'none'; return; }
  const r = el.getBoundingClientRect();
  Object.assign(b.style, { display: 'block', left: `${r.left - 2}px`, top: `${r.top - 2}px`, width: `${r.width + 4}px`, height: `${r.height + 4}px` });
};

let picking = true;
let kerning = false;
let selected = null;
let kernAt = null; // { el, index, pair, word, value, span }

function select(el) {
  selected = el;
  kernAt = null;
  place(selBox, el);
  $('[data-sel]').textContent = el ? label(el) : 'Click anything on the page to select it.';
  showControls();
}

function showControls() {
  const wrap = $('[data-controls]');
  wrap.innerHTML = '';
  if (!selected) return;
  const cs = getComputedStyle(selected);
  const groups = {};
  for (const c of CONTROLS) {
    if (c.show && !c.show(selected, cs)) continue;
    const g = (groups[c.group] ||= Object.assign(document.createElement('fieldset'), { innerHTML: `<legend>${c.group}</legend>` }));
    const v = round(c.read(selected, cs), 2);
    const l = document.createElement('label');
    l.innerHTML = `<span>${c.title} <span class="unit">${c.unit}</span></span><input type="number" step="${c.step}" value="${v}"><input type="range" min="${Math.min(c.min, v)}" max="${Math.max(c.max, v)}" step="${c.step}" value="${v}">`;
    const [num, range] = l.querySelectorAll('input');
    const before = c.read(selected, cs);
    const unit = c.unit === '× size' ? '' : c.unit;
    const fromText = `${round(before, 2)}${unit}`;
    const set = (val) => {
      num.value = val;
      range.value = val;
      const css = c.write(Number(val), selected);
      apply(selected, c.prop, css);
      const existing = changes.find((x) => x.page === page && x.sel === selector(selected) && x.prop === c.prop && x.kind !== 'kern');
      record(selected, c.prop, c.title, existing?.from ?? fromText, `${val}${unit} (${css})`, css);
      place(selBox, selected);
    };
    range.addEventListener('input', () => set(range.value));
    num.addEventListener('change', () => set(num.value));
    g.append(l);
  }
  if (selected.tagName === 'IMG') {
    const g = (groups.Image ||= Object.assign(document.createElement('fieldset'), { innerHTML: '<legend>Image</legend>' }));
    const l = document.createElement('label');
    const now = cs.aspectRatio;
    l.innerHTML = `<span>Shape (aspect ratio)</span><select>${RATIOS.map((r) => `<option ${now.replace(/\s/g, '') === r.replace(/\s/g, '') ? 'selected' : ''}>${r}</option>`).join('')}</select>`;
    const sel = l.querySelector('select');
    sel.addEventListener('change', () => {
      apply(selected, 'aspect-ratio', sel.value);
      record(selected, 'aspect-ratio', 'Shape (aspect ratio)', now, sel.value, sel.value);
      place(selBox, selected);
    });
    g.append(l);
  }
  wrap.append(...Object.values(groups));
}

function renderLog() {
  const list = $('[data-log]');
  list.innerHTML = '';
  $('[data-empty]').hidden = changes.length > 0;
  for (const c of changes) {
    const li = document.createElement('li');
    const where = c.page === page ? '' : ` on ${c.page}`;
    li.textContent = c.kind === 'kern'
      ? `Kerning "${c.pair}" in "${c.word}": ${c.value}/1000 em${where}`
      : `${c.label.split(' "')[0]}, ${c.title.toLowerCase()}: ${c.to.split(' (')[0]}${where}`;
    const b = document.createElement('button');
    b.textContent = 'Undo';
    b.addEventListener('click', () => undo(c));
    li.append(b);
    list.append(li);
  }
  $('[data-bp]').textContent = `Tuning at ${bp()}. Changes are noted with the screen size you made them at.`;
}

// ---------- Page interaction ----------
const ours = (t) => t === host || t === hoverBox || t === selBox;
document.addEventListener('mousemove', (e) => {
  if (!picking || ours(e.target)) return place(hoverBox, null);
  place(hoverBox, e.target);
}, true);
document.addEventListener('click', (e) => {
  if (ours(e.target)) return;
  if (kerning && selected && selected.contains(e.target)) {
    e.preventDefault();
    e.stopPropagation();
    const pos = document.caretPositionFromPoint?.(e.clientX, e.clientY);
    const range = pos ? null : document.caretRangeFromPoint?.(e.clientX, e.clientY);
    const node = pos ? pos.offsetNode : range?.startContainer;
    const offset = pos ? pos.offset : range?.startOffset;
    if (!node || node.nodeType !== 3 || !selected.contains(node)) return;
    const index = indexOf(selected, node, offset) - 1; // the letter left of the click
    const text = selected.textContent;
    if (index < 0 || index >= text.length - 1) return;
    const pair = text.slice(index, index + 2);
    const word = (text.slice(0, index + 1).match(/[\p{L}\p{N}'’&-]*$/u)[0] + text.slice(index + 1).match(/^[\p{L}\p{N}'’&-]*/u)[0]) || pair;
    const sel = selector(selected);
    const saved = changes.find((x) => x.kind === 'kern' && x.page === page && x.sel === sel && x.index === index);
    kernAt = { el: selected, index, pair, word, value: saved?.value ?? 0 };
    const span = setKern(selected, index, kernAt.value);
    if (span) span.style.outline = '1px dashed #e8590c';
    $('[data-kern]').textContent = `Pair "${pair}" in "${word}": ${kernAt.value}/1000 em. Use ← and → (Shift for bigger steps).`;
    return;
  }
  if (!picking) return;
  e.preventDefault();
  e.stopPropagation();
  select(e.target);
}, true);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { select(null); return; }
  if (!kernAt || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
  e.preventDefault();
  kernAt.value += (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 25 : 5);
  const span = setKern(kernAt.el, kernAt.index, kernAt.value);
  if (span) span.style.outline = '1px dashed #e8590c';
  const sel = selector(kernAt.el);
  const i = changes.findIndex((x) => x.kind === 'kern' && x.page === page && x.sel === sel && x.index === kernAt.index);
  const entry = { kind: 'kern', page, sel, label: label(kernAt.el), bp: bp(), index: kernAt.index, pair: kernAt.pair, word: kernAt.word, value: kernAt.value };
  if (kernAt.value === 0 && i >= 0) changes.splice(i, 1);
  else if (i >= 0) changes[i] = entry;
  else if (kernAt.value !== 0) changes.push(entry);
  store.set(changes);
  renderLog();
  $('[data-kern]').textContent = `Pair "${kernAt.pair}" in "${kernAt.word}": ${kernAt.value}/1000 em. Use ← and → (Shift for bigger steps).`;
}, true);
addEventListener('scroll', () => place(selBox, selected), { passive: true });
addEventListener('resize', () => { place(selBox, selected); renderLog(); });

// ---------- Panel buttons ----------
root.addEventListener('click', async (e) => {
  const act = e.target.closest?.('[data-act]')?.dataset.act;
  if (!act) return;
  if (act === 'pick') { picking = !picking; e.target.setAttribute('aria-pressed', picking); if (!picking) place(hoverBox, null); }
  if (act === 'parent' && selected?.parentElement && selected.parentElement !== document.body) select(selected.parentElement);
  if (act === 'kern') {
    kerning = !kerning;
    e.target.setAttribute('aria-pressed', kerning);
    $('[data-kern]').hidden = !kerning;
    if (kerning) { picking = false; $('[data-act=pick]').setAttribute('aria-pressed', 'false'); place(hoverBox, null); }
    kernAt = null;
  }
  if (act === 'copy') {
    const text = copyText();
    try { await navigator.clipboard.writeText(text); e.target.textContent = 'Copied'; }
    catch { prompt('Copy your changes:', text); }
    setTimeout(() => { e.target.textContent = 'Copy my changes'; }, 1500);
  }
  if (act === 'clear' && changes.length && confirm('Clear all your tune mode changes, on every page?')) {
    changes = [];
    store.set(changes);
    location.reload();
  }
  if (act === 'phone' || act === 'tablet') {
    const w = act === 'phone' ? 390 : 820;
    window.open(location.href, `tune-${act}`, `width=${w},height=${act === 'phone' ? 844 : 1100}`);
  }
  if (act === 'off') {
    try { localStorage.removeItem(FLAG); } catch { /* fine */ }
    const u = new URL(location.href);
    u.searchParams.delete('tune');
    location.href = u.toString();
  }
  if (act === 'side') {
    const right = host.style.right === '16px';
    host.style.left = right ? '16px' : 'auto';
    host.style.right = right ? 'auto' : '16px';
    root.querySelector('.fab').style.cssText = right ? '' : 'left:auto;right:16px';
  }
  if (act === 'hide') { $('.panel').hidden = true; $('.fab').hidden = false; picking = false; place(hoverBox, null); }
  if (act === 'open') { $('.panel').hidden = false; $('.fab').hidden = true; }
});

restore();
renderLog();
