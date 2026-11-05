# Turns a piece of work (a map, a chart) into clean one-colour line art: white strokes on transparent, for the
# faint drawings behind the Outcomes figures (Josh, 5 Nov: "turn my map into a black & white icon ... as if it's
# in the glass"). A median filter first wipes out type, figures and hairlines, so only the big shapes are traced:
# a coastline, a river, the bars of a chart. No label or number carries over.
# Usage: python3 -I scripts/line-art.py in.webp out.webp [x0,y0,x1,y1 crop as fractions | -] [colours] [smoothing] [shortest stroke kept]
import sys
from PIL import Image, ImageFilter
import numpy as np
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
if len(sys.argv) > 3 and sys.argv[3] != '-':
    x0, y0, x1, y1 = (float(v) for v in sys.argv[3].split(','))
    W, H = im.size
    im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
k = int(sys.argv[4]) if len(sys.argv) > 4 else 5
smooth = int(sys.argv[5]) if len(sys.argv) > 5 else 9
span = float(sys.argv[6]) if len(sys.argv) > 6 else 0.12
im = im.resize((1200, round(1200 * im.size[1] / im.size[0])), Image.LANCZOS)
im = im.filter(ImageFilter.MedianFilter(smooth)).filter(ImageFilter.MedianFilter(smooth))
q = np.array(im.quantize(k, method=Image.Quantize.MEDIANCUT)).astype(int)
edge = np.zeros(q.shape, bool)
edge[1:] |= q[1:] != q[:-1]
edge[:, 1:] |= q[:, 1:] != q[:, :-1]
edge[:3], edge[-3:], edge[:, :3], edge[:, -3:] = False, False, False, False
# Keep only long strokes: any traced shape smaller than an eighth of the drawing (a letter, a dot, a label box) goes.
from collections import deque
H, W = edge.shape
keep = np.zeros_like(edge); seen = np.zeros_like(edge)
for y, x in zip(*np.nonzero(edge)):
    if seen[y, x]: continue
    q = deque([(y, x)]); seen[y, x] = True; pts = []
    while q:
        cy, cx = q.popleft(); pts.append((cy, cx))
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < H and 0 <= nx < W and edge[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((ny, nx))
    ys, xs = zip(*pts)
    if max(max(ys) - min(ys), max(xs) - min(xs)) > max(W, H) * span:
        for p in pts: keep[p] = True
edge = keep
a = Image.fromarray((edge * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
icon = Image.new('RGBA', a.size, (255, 255, 255, 0)); icon.putalpha(a)
box = a.getbbox()
if box: icon = icon.crop(box)
icon.thumbnail((1000, 1000), Image.LANCZOS)
icon.save(out, 'WEBP', quality=88)
print(out, icon.size)
