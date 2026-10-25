// Which transparent-video file can this browser show with its alpha channel?
// No API reports alpha support, so this checks the engine:
//  - every browser on iPhone and iPad is WebKit underneath (Apple requires it), so HEVC with alpha;
//  - Safari and other WebKit browsers on the Mac: HEVC with alpha;
//  - everything else (Chrome, Edge, Firefox, Android in-app browsers): VP9 WebM with alpha.
// Chrome on the Mac can decode HEVC but drops its alpha, which is why source order alone isn't enough.
export function transparentVideoKind(userAgent = '', maxTouchPoints = 0) {
  const ua = userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua) || (ua.includes('macintosh') && maxTouchPoints > 1);
  if (isIOS) return 'hevc';
  const isWebKit = ua.includes('applewebkit') && !/chrome|chromium|crios|edg|opr|firefox|fxios|android/.test(ua);
  return isWebKit ? 'hevc' : 'webm';
}
