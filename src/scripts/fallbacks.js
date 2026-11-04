// Same site in every browser (Josh, 4 Nov: "consistency across all browsers is key"). Two features the site
// leans on are newer than some browsers still in use; each gets a small stand-in, and does nothing where
// the browser has the real thing.

// 1. Popover menus (Safari before 17, Firefox before 125): the phone menu opens and closes from its
//    buttons, Escape and a tap outside, like the native one. Hidden until opened by the rule in components.css.
if (!('popover' in HTMLElement.prototype)) {
  const set = (p, on) => p?.classList.toggle('is-open', on);
  HTMLElement.prototype.showPopover = function () { set(this, true); };
  HTMLElement.prototype.hidePopover = function () { set(this, false); };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[popovertarget]');
    const target = btn && document.getElementById(btn.getAttribute('popovertarget'));
    document.querySelectorAll('[popover].is-open').forEach((p) => { if (p !== target && !p.contains(e.target)) set(p, false); });
    if (!target) return;
    const act = btn.getAttribute('popovertargetaction');
    set(target, act === 'show' || (act !== 'hide' && !target.classList.contains('is-open')));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('[popover].is-open').forEach((p) => set(p, false)); });
}

// 2. The background's slow drift (Firefox, Safari before 26: no scroll-linked CSS animation). The same
//    movement as band-drift in components.css: over the band's "contain" range, the painting rises by the
//    fifth of its height that sits past the screen (125vh tall, 25vh to spare).
if (!CSS.supports('animation-timeline: view()') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const arts = [...document.querySelectorAll('.band__art')].map((box) => [box, box.querySelector('img')]).filter(([, img]) => img);
  let queued = 0;
  const drift = () => {
    queued = 0;
    const V = innerHeight;
    const moves = arts.map(([box, img]) => {
      const { top, bottom, height } = box.getBoundingClientRect();
      if (bottom < 0 || top > V) return null; // off screen: leave it
      const start = Math.max(0, V - height); // where the contain range starts: tall bands at the top, short ones at the bottom
      const p = Math.min(1, Math.max(0, (start - top) / Math.abs(height - V || 1)));
      return [img, -img.offsetHeight * 0.2 * p];
    });
    moves.forEach((m) => { if (m) m[0].style.transform = `translateY(${m[1].toFixed(1)}px)`; }); // reads first, then writes
  };
  if (arts.length) {
    addEventListener('scroll', () => { queued ||= requestAnimationFrame(drift); }, { passive: true });
    addEventListener('resize', drift);
    drift();
  }
}
