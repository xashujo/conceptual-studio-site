// Same site in every browser (Josh, 4 Nov: "consistency across all browsers is key"). Popover menus are newer
// than some browsers still in use, so they get a small stand-in that does nothing where the browser has them.

// Popover menus (Safari before 17, Firefox before 125): the phone menu opens and closes from its
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
