# Turns the ACL heat map into a one-colour line icon of Essex: coast outline + local authority boundaries.
# Usage: python3 -I scripts/map-line-art.py src/assets/work/acl-essex-infographics/heat-map.webp src/assets/work/acl-essex-infographics/essex-lines.webp
# (Josh, 5 Nov: the map as a black & white icon behind "14 local authorities mapped", sitting in the glass.)
import sys
from collections import deque
from PIL import Image, ImageFilter
import numpy as np
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
W, H = im.size
a = np.array(im).astype(int)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
navy = (B < 95) & (R < 60) & (B - R > 12)
white = (R > 247) & (G > 247) & (B > 247)
bg = np.zeros((H, W), bool); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if white[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if white[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and white[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))
land = ~bg & ~navy
# the place-name labels (white boxes with type) are left out
box = Image.fromarray(((land & white) * 255).astype('uint8')).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(25))
labels = np.array(box) > 0
L = np.array(im.convert('L')).astype(int)
lightest = np.array(im.convert('L').filter(ImageFilter.MaxFilter(5))).astype(int)
line = np.clip((lightest - L - 25) / 60, 0, 1) * (land & ~labels)
# place names set straight on the map: type is dense where a boundary is a single thin stroke
dense = np.array(Image.fromarray((line > 0.3).astype('uint8') * 255).filter(ImageFilter.BoxBlur(14))) / 255
words = np.array(Image.fromarray(((dense > 0.16) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(31))) > 0
line = line * ~words
ink = np.clip(navy.astype(float) + line, 0, 1)
alpha = Image.fromarray((ink * 255).astype('uint8')).resize((1200, 900), Image.LANCZOS)
icon = Image.new('RGBA', alpha.size, (255, 255, 255, 0)); icon.putalpha(alpha)
icon = icon.crop(alpha.getbbox())
icon.save(out, 'WEBP', quality=90)
print(icon.size)
