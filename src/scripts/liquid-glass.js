/*
 * Liquid glass panel: WebGL refraction of a known background <img>.
 * Adapted from liquid-glass-js by Armagan Amcalar (MIT). See liquid-glass.LICENSE.
 *
 * Changes from the original: the texture is a same-origin <img> drawn with
 * object-fit: cover (no html2canvas page snapshot); refraction is measured in
 * CSS px and scaled with the panel; the sampled-gradient pass is gone; the blur
 * is capped at a radius of 4 taps on a mipmapped texture; paper/ink tint with a
 * rim highlight; premultiplied output; renders on demand, never in a loop.
 *
 * mountLiquidGlass(panel, { image, tone, opacity, blur, fade })
 * fade: [start, end] of the image's mask fade to the page, as shares of its height (default: none). -> Promise<{ render, destroy } | null>
 * Resolves null (CSS glass untouched) when WebGL, the shader or the image fail,
 * or under prefers-contrast: more / prefers-reduced-transparency: reduce.
 */
import { dial, onDialChange } from './glass-dials.js';

const VS = `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x, -a_pos.y) * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FS = `precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_size;        // panel, CSS px
uniform float u_radius;     // CSS px
uniform float u_dpr;
uniform vec2 u_uvOrigin;    // image UV under the panel's top-left corner
uniform vec2 u_pxToUv;      // image UV per CSS px
uniform float u_blurPx;     // blur tap spacing in the middle, CSS px
uniform float u_lodBias;
uniform float u_brightness;
uniform float u_saturate;
uniform vec3 u_tint;
uniform float u_tintOpacity;
uniform float u_dark;
uniform vec3 u_fade;       // x,y: where the painting's mask fades out (share of the image box); z: panel top in that box, px
uniform float u_imgH;      // image box height, CSS px
uniform float u_bend;      // BEND times Josh's bend dial
uniform float u_reach;     // Josh's reach dial: widens the bent bezel
uniform float u_frostRim;  // share of the tint kept in the bezel: 0.25 as designed, rising to 1 with the frost dial above 100
uniform float u_rim;       // blur share kept at the rim: 0.06 as designed, rising with the blur dial above 100
uniform float u_shine;     // Josh's shine dial, scales the rim highlight
varying vec2 v_uv;

// iOS 27 / Tahoe-style lens (Josh, 26 Oct): a convex bezel round the edge bends the
// picture behind it outward, with a slight colour split; the middle stays flat and diffused.
const float BEZEL = 0.2;     // bezel width, share of the short side (clamped 14-48px)
const float BEND = 1.1;      // displacement at the rim, share of the bezel width (scaled by u_bend)
const float TAIL_SIGN = -1.0; // the tail stretches what's under the glass outward (a magnifying drag), the rim still pulls the outside in
const float SPLIT = 0.08;    // red/blue split, share of the displacement

void main() {
  vec2 p = v_uv * u_size;
  vec2 c = u_size * 0.5;
  float minDim = min(u_size.x, u_size.y);

  // Rounded-rect SDF (covers pill and circle too): < 0 inside.
  vec2 q = p - c;
  vec2 k = abs(q) - (c - u_radius);
  float sdf = length(max(k, 0.0)) + min(max(k.x, k.y), 0.0) - u_radius;
  float inside = max(-sdf, 0.0);

  // Outward normal = the SDF's gradient.
  vec2 g = (k.x > 0.0 && k.y > 0.0) ? normalize(k) : (k.x > k.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
  vec2 n = g * sign(q + 1e-5);

  // Convex squircle bezel: steepest at the rim, flat by the inner edge of the band.
  float bez = clamp(minDim * BEZEL, 14.0, 48.0) * min(u_reach, 1.0);
  float x = clamp(inside / bez, 0.0, 1.0);
  float lens = pow(1.0 - x, 2.2);
  vec2 off = n * lens * bez * BEND * u_bend;
  // Reach above 100 (Josh, 27 Oct, after the macOS menu): the rim stays as sharp, and a long, soft
  // tail carries a gentler bend on toward the centre. Its direction blends smoothly between the
  // nearest edges, so it swirls round the corners instead of creasing along the diagonals.
  float up = max(u_reach - 1.0, 0.0);
  if (up > 0.0) {
    float len = min(bez * (1.0 + 5.0 * up), minDim * 0.5);
    float tail = pow(1.0 - clamp(inside / len, 0.0, 1.0), 2.0) * 0.55 * min(up, 1.5);
    vec2 toEdge = max(c - abs(q), 0.0);
    vec2 w = exp(-toEdge / max(len * 0.35, 1.0));
    vec2 v = vec2(sign(q.x) * w.x, sign(q.y) * w.y);
    off += v / max(length(v), 1e-4) * tail * bez * BEND * u_bend * TAIL_SIGN;
  }
  vec2 uvG = u_uvOrigin + (p + off) * u_pxToUv;
  vec2 uvR = u_uvOrigin + (p + off * (1.0 + SPLIT)) * u_pxToUv;
  vec2 uvB = u_uvOrigin + (p + off * (1.0 - SPLIT)) * u_pxToUv;

  // Gaussian blur, radius 4 taps, checkerboard-thinned (mipmaps prefilter the gaps).
  // Sharper in the bezel so the bend reads; full diffusion in the middle for the text.
  float spread = mix(u_rim, 1.0, smoothstep(0.15, 1.0, x));
  vec2 stepUv = u_blurPx * spread * u_pxToUv;
  float lod = u_lodBias * spread;
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int i = -4; i <= 4; i++) {
    for (int j = -4; j <= 4; j++) {
      float r2 = float(i * i + j * j);
      if (r2 > 16.0 || mod(float(i + j), 2.0) > 0.5) continue;
      float w = exp(-r2 / 8.0);
      vec2 o = vec2(float(i), float(j)) * stepUv;
      acc += vec3(texture2D(u_image, uvR + o, lod).r, texture2D(u_image, uvG + o, lod).g, texture2D(u_image, uvB + o, lod).b) * w;
      wsum += w;
    }
  }
  vec3 col = acc / wsum;
  // Follow the painting's own fade into the page, so glass over the fade bends paper, not hidden art.
  float yImg = (u_fade.z + p.y + off.y) / u_imgH;
  col = mix(col, u_tint, smoothstep(u_fade.x, u_fade.y, yImg));

  // Match the CSS filter on the painting, then tint toward paper or ink.
  col *= u_brightness;
  col = mix(vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), col, u_saturate);
  col = mix(col, u_tint, u_tintOpacity * mix(u_frostRim, 1.0, smoothstep(0.0, 1.0, x))); // clearer in the bezel, evener as Frost rises

  // Specular on the top rim, rgb(255 250 240), brighter for iOS 27 (TASTE.md glass spec).
  // The light comes from the top left (TASTE 4), so the rim is strongest there.
  float top = max(-n.y, 0.0) * (0.75 + 0.25 * max(-n.x, 0.0));
  col += vec3(1.0, 0.98, 0.94) * exp(-inside * 0.45) * top * mix(0.30, 0.20, u_dark) * u_shine;
  // Above Shine 100, a soft lit band all round the inside of the edge (iOS's glowing rim).
  col += vec3(1.0, 0.99, 0.96) * exp(-inside * 0.12) * 0.35 * max(u_shine - 1.0, 0.0) * (1.0 - 0.6 * u_dark);
  col += vec3(1.0, 0.97, 0.92) * exp(-inside * 0.7) * 0.08 * u_dark * u_shine;
  // iOS 27's darkened edge: a 1px inner ring, black at 10% (light) or 35% (dark).
  col = mix(col, vec3(0.0), (1.0 - smoothstep(0.0, 1.0, inside)) * mix(0.10, 0.35, u_dark));
  col = clamp(col, 0.0, 1.0);

  float aa = 1.0 / u_dpr;
  float mask = 1.0 - smoothstep(-aa, aa, sdf);
  gl_FragColor = vec4(col * mask, mask);
}`;

const UNIFORMS = ['u_image', 'u_size', 'u_radius', 'u_dpr', 'u_uvOrigin', 'u_pxToUv',
  'u_blurPx', 'u_lodBias', 'u_brightness', 'u_saturate', 'u_tint', 'u_tintOpacity', 'u_dark', 'u_fade', 'u_imgH', 'u_bend', 'u_shine', 'u_rim', 'u_reach', 'u_frostRim'];

const TONES = {
  light: { tint: [241 / 255, 223 / 255, 200 / 255], opacity: 0.48, dark: 0 }, // #F1DFC8, clearer for iOS 27 (tuned)
  dark: { tint: [20 / 255, 17 / 255, 13 / 255], opacity: 0.62, dark: 1 }, // #14110D, warm (TASTE 9)
};
const BLUR_PX = 4; // tap spacing; sigma = 2 taps = 8 CSS px
const MAX_TEX = 2048;

const media = (q) => window.matchMedia?.(q).matches;
const filterValue = (filter, name, fallback) => {
  const m = filter && filter.match(new RegExp(`${name}\\(\\s*([\\d.]+)(%?)\\s*\\)`));
  return m ? parseFloat(m[1]) / (m[2] ? 100 : 1) : fallback;
};
const position = (token, free) => {
  if (token?.endsWith('%')) return (free * parseFloat(token)) / 100;
  if (token?.endsWith('px')) return parseFloat(token);
  return free / 2;
};
const radiusPx = (value, width) => (value?.endsWith('%') ? (parseFloat(value) / 100) * width : parseFloat(value) || 0);

function compile(gl) {
  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VS);
  const fs = shader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'a_pos');
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

export async function mountLiquidGlass(panel, { image, tone = 'light', opacity, blur = BLUR_PX, fade = [2, 3], lens = false } = {}) {
  if (!panel || !image) return null;
  if (media('(prefers-contrast: more)') || media('(prefers-reduced-transparency: reduce)')) return null;
  try {
    await image.decode();
  } catch {
    return null;
  }
  const nw = image.naturalWidth;
  const nh = image.naturalHeight;
  if (!nw || !nh) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'lg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: false,
    antialias: false, depth: false, stencil: false,
  });
  const prog = gl && compile(gl);
  if (!prog) return null;
  gl.useProgram(prog);
  const u = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(prog, name)]));

  // One oversized triangle covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Resample to a power-of-two texture (within MAX_TEXTURE_SIZE) so WebGL1 can mipmap it.
  const limit = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), MAX_TEX);
  const pot = (n) => Math.min(limit, 2 ** Math.ceil(Math.log2(n)));
  const off = document.createElement('canvas');
  off.width = pot(nw);
  off.height = pot(nh);
  const ctx = off.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, off.width, off.height);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
  } catch {
    return null;
  }
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u.u_image, 0);
  const t = TONES[tone] || TONES.light;
  gl.uniform3fv(u.u_tint, t.tint);
  const tint = opacity ?? t.opacity; // a plate raises its tint until its text reads
  gl.uniform1f(u.u_dark, t.dark);
  gl.clearColor(0, 0, 0, 0);

  panel.prepend(canvas);
  panel.style.isolation = 'isolate'; // keep the z-index:-1 canvas inside the panel once backdrop-filter is removed

  let inView = false;
  let raf = 0;
  let drawn = false;
  let dead = false;

  function render() {
    raf = 0;
    if (dead || gl.isContextLost()) return;
    const pr = canvas.getBoundingClientRect();
    const ir = image.getBoundingClientRect();
    if (!pr.width || !pr.height || !ir.width || !ir.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(pr.width * dpr);
    const h = Math.round(pr.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // object-fit: cover + object-position -> where the painting's pixels sit on screen.
    const ics = getComputedStyle(image);
    const s = Math.max(ir.width / nw, ir.height / nh);
    const rw = nw * s;
    const rh = nh * s;
    const [posX, posY] = ics.objectPosition.split(/\s+/);
    const ox = ir.left + position(posX, ir.width - rw);
    const oy = ir.top + position(posY, ir.height - rh);
    const minDim = Math.min(pr.width, pr.height);
    const radius = Math.min(radiusPx(getComputedStyle(canvas).borderTopLeftRadius, pr.width), minDim / 2);

    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.u_size, pr.width, pr.height);
    gl.uniform1f(u.u_radius, radius);
    gl.uniform1f(u.u_dpr, dpr);
    gl.uniform2f(u.u_uvOrigin, (pr.left - ox) / rw, (pr.top - oy) / rh);
    gl.uniform2f(u.u_pxToUv, 1 / rw, 1 / rh);
    gl.uniform3f(u.u_fade, fade[0], fade[1], pr.top - ir.top);
    gl.uniform1f(u.u_imgH, ir.height);
    // Josh's dials (Site settings > Glass): 1 = as designed.
    // The clear lens goes much further above 100, toward Apple's frosted panels (as components.css).
    const up = (d) => Math.max(0, d - 1);
    const b = blur * dial('blur') + (lens ? 11 * up(dial('blur')) : 0);
    gl.uniform1f(u.u_blurPx, b);
    gl.uniform1f(u.u_lodBias, Math.max(0, Math.log2(Math.max(b, 0.01) * 1.4 * dpr) - 0.5));
    gl.uniform1f(u.u_tintOpacity, Math.min(0.96, tint * dial('frost') + (lens ? 0.34 * up(dial('frost')) : 0)));
    gl.uniform1f(u.u_bend, dial('bend'));
    gl.uniform1f(u.u_shine, dial('shine'));
    gl.uniform1f(u.u_reach, dial('reach'));
    gl.uniform1f(u.u_frostRim, 0.25 + 0.75 * Math.min(1, up(dial('frost')) * 1.5));
    gl.uniform1f(u.u_rim, 0.06 + 0.8 * Math.min(1, Math.max(0, dial('blur') - 1)));
    gl.uniform1f(u.u_brightness, filterValue(ics.filter, 'brightness', 1));
    gl.uniform1f(u.u_saturate, filterValue(ics.filter, 'saturate', 1));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!drawn && gl.getError() === gl.NO_ERROR) {
      drawn = true;
      panel.classList.add('has-liquid');
    }
  }

  const schedule = () => {
    if (!raf && inView && !dead) raf = requestAnimationFrame(render);
  };
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedule();
  }, { rootMargin: '120px' });
  const ro = new ResizeObserver(schedule);
  io.observe(panel);
  ro.observe(panel);
  ro.observe(image);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  onDialChange(schedule);

  function destroy() {
    if (dead) return;
    dead = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    panel.classList.remove('has-liquid');
    panel.style.isolation = '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  }
  canvas.addEventListener('webglcontextlost', destroy); // fall back to the CSS glass

  return { render, destroy };
}
