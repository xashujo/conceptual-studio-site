// Josh's gold flow plays once through the logo when it comes into view (nav on load, footer on scroll),
// like the "Conceptual" video on his old site (6 Nov). The video starts on the plain type (its poster) and
// ends on the finished logo and stays there.
// Transparent video: VP9 WebM for Chrome, Firefox and Edge; HEVC with alpha (.mov, exported by Josh) for Safari.
// Reduced motion keeps the still logo.
// Which file to play: WebKit is the only engine that shows transparent HEVC, and every iPhone/iPad browser,
// in-app ones included (Instagram, TikTok, Facebook), is WebKit; newer iPads report as Macs. Those get the .mov
// as a <source type="video/quicktime"> (as on Josh's old Framer site); everything else gets the WebM.
const ua = navigator.userAgent;
const mov = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox|Android/.test(ua));

function load(v) {
  const s = document.createElement('source');
  s.src = mov ? v.dataset.mov : v.dataset.webm; // from Site settings > Logo animation
  s.type = mov ? 'video/quicktime' : 'video/webm';
  v.muted = true; // iOS only autoplays when the property is set, not just the attribute
  v.replaceChildren(s);
  v.load();
}

function run() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      play(e.target);
    }
  }, { threshold: 0.6 });
  for (const box of document.querySelectorAll('[data-flow]')) {
    for (const v of box.querySelectorAll('video.gold-flow')) if (v.dataset.poster) v.poster = v.dataset.poster;
    box.classList.add('is-flowing'); // the plain type until it plays
    io.observe(box);
  }
}

function play(box) {
  // The nav has an ink and a cream version, and the page can switch between them at any moment (loading
  // or scrolling into a night chapter). Both play together, so whichever one shows is always mid-flow.
  const vids = [...box.querySelectorAll('video.gold-flow')];
  let started = false;
  const still = () => { if (!started) box.classList.remove('is-flowing'); }; // never played: the still logo
  for (const v of vids) {
    v.addEventListener('playing', () => { started = true; }, { once: true });
    v.addEventListener('error', still, { once: true });
    v.preload = 'auto';
    load(v);
  }
  // Start together once every tone can play, so they stay in step.
  Promise.all(vids.map((v) => (v.readyState >= 3 ? 1 : new Promise((r) => {
    v.addEventListener('canplay', r, { once: true });
    v.addEventListener('error', r, { once: true });
  })))).then(() => { for (const v of vids) v.play().catch(still); }); // autoplay blocked (e.g. Low Power Mode)
  // Josh (6 Nov): it ends and stays on its last frame, with no swap to the still image.
  setTimeout(() => { if (!started) still(); }, 3000); // never started
}

run();
