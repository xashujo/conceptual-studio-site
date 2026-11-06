"""Portrait crop of the Lemoyne ceiling for the night close on phones and tablets (6 Nov).

lemoyne-night.jpg is a 1900x1056 landscape crop of apotheosis-strip.jpg (x 300, y 1240), toned warm dark.
Stretched over the tall close and footer on a phone it zoomed 3-5x and pixelated, so narrow screens get a
taller crop of the same strip, toned to the same colours: the strip's grey is histogram-matched to the night
crop's, then mapped through the night crop's mean colour at each grey level.

    python3 scripts/night-portrait.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

ART = Path(__file__).resolve().parent.parent / 'src/assets/art/engraved'
strip = Image.open(ART / 'apotheosis-strip.jpg').convert('L')
night = np.asarray(Image.open(ART / 'lemoyne-night.jpg').convert('RGB'), float)

crop = np.asarray(strip.crop((350, 1000, 2150, 4000)), float)  # 1800x3000, centred on the night crop

# The night crop's own grey, and its mean colour at each grey level.
nl = (night @ [0.299, 0.587, 0.114]).round().clip(0, 255).astype(int)
lut = np.zeros((256, 3))
for v in range(256):
    m = nl == v
    lut[v] = night[m].mean(0) if m.any() else np.nan
idx = np.arange(256)
for c in range(3):
    ok = ~np.isnan(lut[:, c])
    lut[:, c] = np.interp(idx, idx[ok], lut[ok, c])

# Match the crop's grey histogram to the night crop's.
src_cdf = np.cumsum(np.bincount(crop.round().astype(int).ravel(), minlength=256)) / crop.size
ref_cdf = np.cumsum(np.bincount(nl.ravel(), minlength=256)) / nl.size
match = np.interp(src_cdf, ref_cdf, idx).round().astype(int)
out = lut[match[crop.round().astype(int)]].clip(0, 255).astype(np.uint8)

Image.fromarray(out).save(ART / 'lemoyne-night-tall.jpg', quality=72, optimize=True, progressive=True)
print('wrote', ART / 'lemoyne-night-tall.jpg')
