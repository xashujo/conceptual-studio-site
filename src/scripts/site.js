// Site behaviour. Everything here enhances content that is already on the page.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The phone tab bar switches to its dark tint over dark sections. */
function initDock() {
  const dock = document.querySelector('[data-dock]');
  if (!dock || matchMedia('(min-width: 900px)').matches) return;
  const glass = dock.querySelector('.glass');
  const under = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
    const dark = under.size > 0;
    dock.dataset.over = dark ? 'dark' : 'light';
    glass?.setAttribute('data-tone', dark ? 'dark' : 'light');
  }, { rootMargin: '-88% 0px -30px 0px' });
  document.querySelectorAll('.is-dark').forEach((el) => io.observe(el));
}

/* The hero's project viewer: crossfades through the featured work. */
function initViewer() {
  const v = document.querySelector('[data-viewer]');
  if (!v) return;
  const slides = [...v.querySelectorAll('[data-slide]')];
  const bars = [...v.querySelectorAll('.viewer__bar span')];
  const title = v.querySelector('[data-viewer-title]');
  const meta = v.querySelector('[data-viewer-meta]');
  const link = v.querySelector('[data-viewer-link]');
  const count = v.querySelector('[data-viewer-count]');
  const DUR = 5000;
  let i = 0;
  let timer;
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.tabIndex = k === i ? 0 : -1; });
    bars.forEach((b, k) => { b.classList.remove('is-active'); if (k === i) { void b.offsetWidth; b.classList.add('is-active'); } });
    title.textContent = slides[i].dataset.title;
    meta.textContent = slides[i].dataset.meta;
    link.href = slides[i].getAttribute('href');
    count.textContent = String(i + 1).padStart(2, '0');
    schedule();
  };
  const schedule = () => { clearTimeout(timer); if (!reduceMotion && !v.classList.contains('is-paused')) timer = setTimeout(() => show(i + 1), DUR); };
  v.style.setProperty('--dur', `${DUR}ms`);
  v.querySelector('[data-viewer-prev]').addEventListener('click', () => show(i - 1));
  v.querySelector('[data-viewer-next]').addEventListener('click', () => show(i + 1));
  v.addEventListener('pointerenter', () => { v.classList.add('is-paused'); clearTimeout(timer); });
  v.addEventListener('pointerleave', () => { v.classList.remove('is-paused'); show(i); });
  if (reduceMotion) v.classList.add('is-paused');
  schedule();
}

/* Copy email buttons. */
function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    if (!navigator.clipboard) return;
    btn.hidden = false;
    const state = btn.querySelector('.copy-email__state');
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); state.textContent = 'Copied'; }
      catch { state.textContent = 'Press Ctrl+C'; }
      setTimeout(() => (state.textContent = 'Copy'), 2200);
    });
  });
}

/* London time on the contact page. */
function initClock() {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30_000);
}

/* The live chart: a table that becomes a chart. */
function initLive() {
  document.querySelectorAll('[data-live]').forEach((live) => {
    const buttons = live.querySelectorAll('[data-view-button]');
    live.querySelectorAll('.line').forEach((l) => l.style.setProperty('--len', String(Math.ceil(l.getTotalLength()))));
    const set = (view) => {
      live.dataset.view = view;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.viewButton === view)));
    };
    buttons.forEach((b) => b.addEventListener('click', () => set(b.dataset.viewButton)));
    set('table');
  });
}

/* Work filters, with a Flip re-layout. */
async function initFilters() {
  const root = document.querySelector('[data-filters]');
  if (!root) return;
  const items = [...document.querySelectorAll('[data-category]')];
  const empty = document.querySelector('[data-empty]');
  const status = document.querySelector('[data-filter-status]');
  let Flip = null;
  if (!reduceMotion) {
    const [{ gsap }, mod] = await Promise.all([import('gsap'), import('gsap/Flip')]);
    gsap.registerPlugin(mod.Flip);
    Flip = mod.Flip;
  }
  root.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      const state = Flip?.getState(items);
      root.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      items.forEach((el) => {
        const match = f === 'all' ? el.dataset.archive !== 'true' : f === 'archive' ? el.dataset.archive === 'true' : el.dataset.category === f && el.dataset.archive !== 'true';
        el.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (status) status.textContent = `${shown} project${shown === 1 ? '' : 's'} shown`;
      if (Flip && state) Flip.from(state, { duration: 0.6, ease: 'power3.out', absolute: true, onEnter: (els) => els.forEach((e) => (e.style.opacity = 1)) });
    });
  });
}

/* Quiet entrances: cards and panels rise in once as they arrive. No scroll-jacking. */
function initReveal() {
  if (reduceMotion) return;
  const els = document.querySelectorAll('.card, .answer, .price-card, .quote, .tier, .steps li');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards', delay: (Number(e.target.dataset.i) || 0) * 70 });
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    const item = el.closest('li') ?? el;
    el.dataset.i = String([...item.parentElement.children].indexOf(item) % 3);
    io.observe(el);
  });
}

/* Liquid glass: refraction on the header bar in Chromium, and the WebGL glass over engravings. */
function initGlass() {
  const bar = document.querySelector(matchMedia('(min-width: 900px)').matches ? '.site-header__bar' : '.dock .glass');
  if (bar) import('./refraction.js').then((m) => m.mountRefraction?.(bar)).catch(() => {});
  document.querySelectorAll('[data-liquid]').forEach((panel) => {
    const img = panel.closest('[data-liquid-field]')?.querySelector('.engraving img');
    if (!img) return;
    const go = () => import('./liquid-glass.js').then((m) => m.mountLiquidGlass?.(panel, { image: img, tone: panel.dataset.liquid || 'light' })).catch(() => {});
    img.complete ? go() : img.addEventListener('load', go, { once: true });
  });
}

initDock();
initViewer();
initCopy();
initClock();
initLive();
initFilters();
initReveal();
initGlass();
