// Site behaviour. Everything here enhances content that is already on the page.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The bar is plain at the top of the page and turns to glass once the page moves under it. */
function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', scrollY > 8);
  update();
  addEventListener('scroll', update, { passive: true });
}

/* Phones: the menu sheet. */
function initMenu() {
  const menu = document.querySelector('[data-menu]');
  const open = document.querySelector('[data-menu-open]');
  if (!menu || !open) return;
  const close = menu.querySelector('[data-menu-close]');
  let glass = false;
  const set = (on) => {
    menu.classList.toggle('is-open', on);
    menu.setAttribute('aria-hidden', String(!on));
    open.setAttribute('aria-expanded', String(on));
    document.body.classList.toggle('menu-open', on);
    if (on) {
      close.focus();
      if (!glass) { glass = true; mountLiquid(menu); }
    } else open.focus();
  };
  open.addEventListener('click', () => set(true));
  close.addEventListener('click', () => set(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) set(false); });
  menu.querySelectorAll('.menu__links a').forEach((a) => a.addEventListener('click', () => set(false)));
}

/* The highlights row: buttons, dots, and the right button state at each end. */
function initReel() {
  const reel = document.querySelector('[data-reel]');
  if (!reel) return;
  const track = reel.querySelector('[data-reel-track]');
  const items = [...track.children];
  const dots = [...reel.querySelectorAll('.reel__dots span')];
  const prev = reel.querySelector('[data-reel-prev]');
  const next = reel.querySelector('[data-reel-next]');
  const step = () => items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft < 8;
    next.disabled = track.scrollLeft > max - 8;
    const i = Math.round(track.scrollLeft / step());
    const cur = Math.min(i, dots.length - 1);
    dots.forEach((d, k) => d.classList.toggle('is-active', k === cur));
    const vw = document.documentElement.clientWidth;
    items.forEach((it) => { const r = it.getBoundingClientRect(); it.classList.toggle('is-current', r.left >= -4 && r.right <= vw + 4); });
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  reel.classList.add('is-ready');
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

/* Entrances: heading, then text, then pictures, rising once as each section arrives.
   Content is never hidden if this script does not run. */
function initReveal() {
  if (reduceMotion) return;
  const els = [...document.querySelectorAll('[data-reveal], .card, .case-section > *, .block, .block--pair')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 850, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards', delay: Number(e.target.dataset.revealDelay || 0) });
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  const seen = new Map();
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    const group = el.parentElement;
    const n = seen.get(group) ?? 0;
    seen.set(group, n + 1);
    el.dataset.revealDelay = String(Math.min(n, 5) * 75);
    io.observe(el);
  });
}

/* Liquid glass: refraction on the bar in Chromium, and the WebGL glass on the menu sheet over its engraving. */
function mountLiquid(field) {
  const panel = field.querySelector('[data-liquid]');
  const img = field.querySelector('[data-liquid-art] img');
  if (!panel || !img) return;
  const go = () => import('./liquid-glass.js').then((m) => m.mountLiquidGlass?.(panel, { image: img, tone: panel.dataset.liquid || 'light' })).catch(() => {});
  img.loading = 'eager';
  img.complete && img.naturalWidth ? go() : img.addEventListener('load', go, { once: true });
}
function initGlass() {
  const bar = document.querySelector('.site-header__bar');
  if (bar && matchMedia('(min-width: 900px)').matches) import('./refraction.js').then((m) => m.mountRefraction?.(bar)).catch(() => {});
}

initHeader();
initMenu();
initReel();
initCopy();
initClock();
initLive();
initFilters();
initReveal();
initGlass();
