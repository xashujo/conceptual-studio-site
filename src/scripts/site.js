// Site behaviour. Everything here enhances content that is already visible without JavaScript.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The phone tab bar switches to its dark tint over dark sections. */
function initDock() {
  const dock = document.querySelector('[data-dock]');
  if (!dock || matchMedia('(min-width: 900px)').matches) return;
  const darks = document.querySelectorAll('.is-dark, .site-footer');
  if (!darks.length) return;
  const glass = dock.querySelector('.glass');
  const under = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
    const dark = under.size > 0;
    dock.dataset.over = dark ? 'dark' : 'light';
    glass?.setAttribute('data-tone', dark ? 'dark' : 'light');
  }, { rootMargin: '-88% 0px -30px 0px' });
  darks.forEach((el) => io.observe(el));
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

/* Drag row: buttons and the progress bar. */
function initRows() {
  document.querySelectorAll('[data-row]').forEach((row) => {
    const track = row.querySelector('.row__track');
    const bar = row.querySelector('.row__bar span');
    const [prev, next] = row.querySelectorAll('.round-button');
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      bar?.style.setProperty('--p', String(Math.max(0.12, p)));
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft > max - 8;
    };
    const step = () => track.querySelector('.row__item')?.getBoundingClientRect().width + 32 || 300;
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });
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

/* Work filters, with a Flip re-layout when motion is allowed. */
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

/* Entrances: heading, then text, then pictures, once, as each section arrives. */
async function initMotion() {
  const shutters = document.querySelectorAll('.shutter');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  shutters.forEach((el) => io.observe(el));

  const groups = document.querySelectorAll('[data-reveal-group]');
  const counters = document.querySelectorAll('[data-count]');
  if (reduceMotion || (!groups.length && !counters.length)) return;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  groups.forEach((group) => {
    // Only sections still below the fold get an entrance, so nothing visible ever blinks out.
    if (group.getBoundingClientRect().top < innerHeight) return;
    const parts = group.querySelectorAll('[data-reveal]');
    gsap.set(parts, { opacity: 0, y: 22 });
    gsap.to(parts, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });
  counters.forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('en-GB') + suffix),
    });
  });
}

/* Liquid glass: live refraction on the bar in Chromium, and the WebGL glass over paintings. */
async function initGlass() {
  const panels = document.querySelectorAll('[data-liquid]');
  const bar = document.querySelector(matchMedia('(min-width: 900px)').matches ? '.site-header__bar' : '.dock .glass');
  if (bar) import('./refraction.js').then((m) => m.mountRefraction?.(bar)).catch(() => {});
  panels.forEach((panel) => {
    const img = panel.closest('[data-liquid-field]')?.querySelector('img');
    if (!img) return;
    import('./liquid-glass.js')
      .then((m) => m.mountLiquidGlass?.(panel, { image: img, tone: panel.dataset.liquid || 'light' }))
      .catch(() => {});
  });
}

initDock();
initCopy();
initClock();
initRows();
initLive();
initFilters();
initMotion();
initGlass();
