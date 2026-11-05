# Cut a chart's bars out as a one-colour icon: the data bars solid, their light tracks faint, no type or figures.
# Usage: python3 -I scripts/chart-icon.py in.webp out.webp x0,y0,x1,y1 [min bar thickness px]
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
src, out, crop = sys.argv[1:4]
t = int(sys.argv[4]) if len(sys.argv) > 4 else 10
im = Image.open(src).convert('RGB'); W, H = im.size
x0, y0, x1, y1 = (float(v) for v in crop.split(',')); im = im.crop((int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
a = np.asarray(im).astype(int); lum = a.mean(2); sat = a.max(2) - a.min(2)
def bars(m):
    m = nd.binary_opening(m, iterations=t // 2)
    lab, n = nd.label(m)
    keep = [i + 1 for i, s in enumerate(nd.find_objects(lab)) if min(s[0].stop - s[0].start, s[1].stop - s[1].start) >= t and max(s[0].stop - s[0].start, s[1].stop - s[1].start) >= 4 * t]
    return np.isin(lab, keep)
solid = bars((sat > 45) | (lum < 90))
track = bars((lum > 200) & (lum < 236) & (sat < 14)) & ~solid
alpha = np.zeros(lum.shape, 'uint8'); alpha[track] = 90; alpha[solid] = 255
al = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.6)); al = al.crop(al.getbbox())
o = Image.new('RGBA', al.size, (255, 255, 255, 0)); o.putalpha(al); o.thumbnail((1000, 1000)); o.save(out, 'WEBP', quality=90); print(out, o.size)
