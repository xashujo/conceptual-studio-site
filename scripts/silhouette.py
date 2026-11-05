# Cut a filled one-colour silhouette out of a piece of work (a map, a mark, a chart) for a bento icon.
# Maps: the whole shape solid, with a thin gap cut where the land meets the map's border ring, and the map's own
# long borders (districts, rivers) cut as gaps. Type, labels and figures are dropped as short strokes.
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
# Usage: python3 -I scripts/silhouette.py in.webp out.webp [x0,y0,x1,y1 | -] map|light <white cut-off> [border length share] [line darkness]
src, out, crop, mode, thr = sys.argv[1:6]
borders = float(sys.argv[6]) if len(sys.argv) > 6 else 0   # keep inner lines longer than this share of the map; 0 = none
im = Image.open(src).convert('RGB')
if crop != '-':
    W, H = im.size; x0, y0, x1, y1 = (float(v) for v in crop.split(',')); im = im.crop((int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
im = im.resize((1400, round(1400 * im.size[1] / im.size[0])), Image.LANCZOS)
lum = np.asarray(im.convert('L')).astype(int)
if mode == 'light':
    m = lum > float(thr)
else:
    m = nd.binary_fill_holes(nd.binary_closing(lum < float(thr), iterations=3))
lab, n = nd.label(m); sizes = nd.sum(m, lab, range(1, n + 1))
m = np.isin(lab, 1 + np.nonzero(sizes > sizes.max() * 0.01)[0])
if mode == 'map':
    # An inset contour a little inside the coast, like the map's own border ring, then the map's thin inner lines
    # (districts, rivers) as gaps. Thin only: a dark-shaded district or a label is not a line, so it stays solid.
    k = max(4, round(max(m.shape) * 0.018))
    core = nd.binary_erosion(m, iterations=k)
    m = m & ~(core & ~nd.binary_erosion(core, iterations=4))
    if borders:
        dark = lum < float(sys.argv[7]) if len(sys.argv) > 7 else lum < 120
        thin = dark & ~nd.binary_opening(dark, iterations=3) & nd.binary_erosion(core, iterations=4)
        lab, n = nd.label(thin, structure=np.ones((3, 3)))
        big = [i + 1 for i, s in enumerate(nd.find_objects(lab)) if max(s[0].stop - s[0].start, s[1].stop - s[1].start) > max(m.shape) * borders]
        m = m & ~nd.binary_dilation(np.isin(lab, big), iterations=1)
alpha = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
alpha = alpha.crop(alpha.getbbox())
o = Image.new('RGBA', alpha.size, (255, 255, 255, 0)); o.putalpha(alpha); o.thumbnail((900, 900)); o.save(out, 'WEBP', quality=90); print(out, o.size)
