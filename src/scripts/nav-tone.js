// Nav tone: light over the night chapters, dark over day. Each frame that scrolls, it checks which chapter is
// under the nav's middle line. It used to be an IntersectionObserver with a rootMargin worked out from
// innerHeight, but iOS Safari (and in-app browsers) change the viewport's height as the toolbars slide, so the
// line drifted and the nav turned dark well before the night band reached it (Josh, 6 Nov).
export function navTone(nav) {
  const nights = [...document.querySelectorAll('.night')];
  if (!nav || !nights.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const r = nav.getBoundingClientRect();
    const y = r.top + r.height / 2;
    nav.classList.toggle('is-dark', nights.some((n) => {
      const b = n.getBoundingClientRect();
      return b.top <= y && b.bottom > y;
    }));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
}
