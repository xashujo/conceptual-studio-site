// Fade-ins (Josh, 4 Nov): pieces that start below the screen rise in as they scroll into view, a few at a time.
// Only this script hides anything, and only what is off screen when it runs, so without script or with
// reduced motion everything simply shows, and nothing already on screen blinks. CSS: .rv in components.css.

// What rises: each block of a section, and each item of a list or grid instead of the list as a whole.
const SECTION = ':is(.band > :is(section, header), .close)';
const SEL = [
  `${SECTION} > :not(script, .ph__plate)`,
  `${SECTION} > :is(ul, ol, .fw__grid, .ladder, .proof__grid, .groups, .ab-groups, .ab-story, .cs-two, .sv-ex, .row, .head, .wb, .svc) > :not(script)`,
  '.svc__list > li, .stats__list > li, .wb__grid > li, [data-reveal]',
].join(', ');

export function reveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const all = [...document.querySelectorAll(SEL)];
  // Reads first, then writes. A piece holding other pieces stays put; its pieces rise instead.
  const off = all.filter((el) => {
    if (all.some((o) => o !== el && el.contains(o))) return false;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return true; // hidden for now (filters, Show More)
    return r.top > innerHeight && r.left < innerWidth && r.right > 0; // below the screen, not off to the side in a swipe row
  });
  const io = new IntersectionObserver((entries) => {
    let n = 0; // pieces arriving together follow each other, 90ms apart
    entries.forEach(({ isIntersecting, target: el }) => {
      if (!isIntersecting) return;
      io.unobserve(el);
      const own = !el.style.getPropertyValue('--i');
      if (own) el.style.setProperty('--i', String(Math.min(n++, 5)));
      el.classList.add('is-in');
      // Done: hand the piece back to its own styles (the 700ms rise plus its delay, as .rv in the CSS).
      setTimeout(() => {
        el.classList.remove('rv', 'is-in');
        if (own) el.style.removeProperty('--i');
      }, 760 + Number(el.style.getPropertyValue('--i')) * 90);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  off.forEach((el) => { el.classList.add('rv'); io.observe(el); });
}
