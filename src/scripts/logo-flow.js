// Josh's gold flow plays once through the logo when it comes into view (nav on load, footer on scroll),
// like the "Conceptual" video on his old site (6 Nov). The video starts on the plain type (its poster) and
// ends on the finished logo and stays there.
// Transparent video: VP9 WebM for Chrome, Firefox and Edge; HEVC with alpha (.mov, exported by Josh) for Safari.
// Reduced motion keeps the still logo.
// Which file to play follows the code from Josh's old Framer site, which worked everywhere including in-app
// browsers: Safari (iPhone, iPad, Mac) and Instagram on iPhone get the .mov as a <source type="video/quicktime">;
// everything else gets the WebM. Other in-app browsers on iPhone (Facebook, TikTok...) keep the still.
const ua = navigator.userAgent.toLowerCase();
const ios = /iphone|ipad|ipod/.test(ua) || (/macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const macSafari = /^((?!chrome|android).)*safari/.test(ua);
const embedded = /instagram|fbav|fban|tiktok|line|pinterest/.test(ua);
const mov = (ios || macSafari) && (!embedded || (ios && /instagram/.test(ua)));
const skip = ios && !mov;

function load(v) {
  const s = document.createElement('source');
  s.src = mov ? v.dataset.mov : v.dataset.webm; // from Site settings > Logo animation
  s.type = mov ? 'video/quicktime' : 'video/webm';
  v.replaceChildren(s);
  v.load();
}

function run() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || skip) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      setTimeout(() => play(e.target), 150); // let the nav pick its tone first
    }
  }, { threshold: 0.6 });
  for (const box of document.querySelectorAll('[data-flow]')) {
    for (const v of box.querySelectorAll('video.gold-flow')) if (v.dataset.poster) v.poster = v.dataset.poster;
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
      load(o);
    }
  }, { once: true });
  load(v);
  v.play().catch(still); // autoplay blocked (e.g. Low Power Mode)
  setTimeout(() => { if (v.currentTime === 0) still(); }, 3000); // never started
}

run();
