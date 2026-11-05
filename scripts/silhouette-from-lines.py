# Essex icon: the traced map (essex-lines) filled solid, an inset ring inside the coast, districts and estuaries as gaps.
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
a = np.asarray(Image.open(sys.argv[1]).convert('RGBA'))[:, :, 3] > 110
m = nd.binary_fill_holes(nd.binary_closing(np.pad(a, 20), iterations=int(sys.argv[3])))[20:-20, 20:-20]
k = max(4, round(max(m.shape) * 0.018))
core = nd.binary_erosion(m, iterations=k)
m2 = m & ~(core & ~nd.binary_erosion(core, iterations=4))
thin = a & ~nd.binary_opening(a, iterations=4)
m2 = m2 & ~nd.binary_dilation(thin & nd.binary_erosion(core, iterations=3), iterations=1)
lab, n = nd.label(~m2); m2 |= np.isin(lab, 1 + np.nonzero(nd.sum(~m2, lab, range(1, n + 1)) < 40)[0])
al = Image.fromarray((m2 * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8)); al = al.crop(al.getbbox())
o = Image.new('RGBA', al.size, (255, 255, 255, 0)); o.putalpha(al); o.save(sys.argv[2], 'WEBP', quality=90)
