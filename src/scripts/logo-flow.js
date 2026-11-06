// Josh's gold flow plays once through the logo when it comes into view (nav on load, footer on scroll),
// like the "Conceptual" video on his old site (6 Nov). The video starts on the plain type (its poster) and
// ends on the finished logo and stays there.
// Transparent video: VP9 WebM for Chrome, Firefox and Edge; HEVC with alpha (.mov, exported by Josh) for Safari.
// Reduced motion keeps the still logo.
const HEVC = false; // off: the .mov alpha showed as a black box in iOS Safari (6 Nov)
const V = '?v=6'; // bump when the videos change, so browsers don't keep the old ones
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
    for (const v of box.querySelectorAll('video.gold-flow')) v.poster = v.dataset.src + '-start.webp' + V;
    box.classList.add('is-flowing'); // the plain type until it plays
    io.observe(box);
  }
}

function play(box) {
  const vids = [...box.querySelectorAll('video.gold-flow')];
  // The nav has an ink and a cream version: play the one showing.
  const v = vids.find((x) => getComputedStyle(x).opacity !== '0') || vids[0];
  let started = false;
  const still = () => { if (!started) box.classList.remove('is-flowing'); }; // never played: the still logo
  v.addEventListener('playing', () => { started = true; }, { once: true });
  v.addEventListener('error', still, { once: true });
  // Josh (6 Nov): it ends and stays on its last frame, with no swap to the still image. The nav's other
  // tone loads straight to its last frame too, so the logo can still change tone over the night chapters.
  v.addEventListener('ended', () => {
    for (const o of vids) if (o !== v) {
      o.preload = 'auto';
      o.addEventListener('loadedmetadata', () => { o.currentTime = Number.isFinite(o.duration) ? o.duration : 4.2; }, { once: true });
      o.src = o.dataset.src + ext + V;
    }
  }, { once: true });
  v.src = v.dataset.src + ext + V;
  v.play().catch(still); // autoplay blocked (e.g. Low Power Mode)
  setTimeout(() => { if (v.currentTime === 0) still(); }, 3000); // never started
}

run();
