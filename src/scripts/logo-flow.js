// Josh's gold flow plays once through the logo when it comes into view (nav on load, footer on scroll),
// like the "Conceptual" video on his old site (6 Nov). The video starts on the plain type (its poster) and
// ends on the finished logo, so the still image takes back over without a jump.
// Transparent video: VP9 WebM for Chrome, Firefox and Edge. Safari needs HEVC with alpha (.mov), so it
// keeps the still logo until those files exist; then set HEVC to true. Reduced motion keeps the still too.
const HEVC = false;
const webkit = /Apple/.test(navigator.vendor);
const ext = webkit ? '.mov' : '.webm';

function run() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || (webkit && !HEVC)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      setTimeout(() => play(e.target), 150); // let the nav pick its tone first
    }
  }, { threshold: 0.6 });
  for (const box of document.querySelectorAll('[data-flow]')) {
    for (const v of box.querySelectorAll('video.flow')) v.poster = v.dataset.src + '-start.webp';
    box.classList.add('is-flowing'); // the plain type until it plays
    io.observe(box);
  }
}

function play(box) {
  const vids = [...box.querySelectorAll('video.flow')];
  // The nav has an ink and a cream version: play the one showing.
  const v = vids.find((x) => getComputedStyle(x).opacity !== '0') || vids[0];
  let done = false;
  const end = () => { if (!done) { done = true; box.classList.remove('is-flowing'); } };
  v.addEventListener('ended', end, { once: true });
  v.addEventListener('error', end, { once: true });
  v.src = v.dataset.src + ext;
  v.play().catch(end); // autoplay blocked (e.g. Low Power Mode): the still logo
  setTimeout(() => { if (v.currentTime === 0) end(); }, 3000); // never started
}

run();
