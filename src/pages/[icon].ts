// The favicon set, made at build time from the one image in Site settings > Favicon (Pages CMS).
// Upload a new image there and every size below is remade from it on the next build.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntry } from 'astro:content';
import sharp from 'sharp';

const NIGHT = '#14110D'; // the site's night colour, behind the home-screen icon

// Transparent-edged art is trimmed to the mark, so it fills the tab instead of floating in empty space.
async function art() {
  const path = (await getEntry('settings', 'site'))!.data.favicon.replace(/^@assets\//, './src/assets/');
  const { hasAlpha } = await sharp(path).metadata();
  return hasAlpha ? sharp(path).trim().toBuffer() : sharp(path).toBuffer();
}

// Square PNG, the mark centred and as large as it fits. `pad` is the margin on each side, as a share of the size.
async function png(src: Buffer, size: number, pad = 0, background = { r: 0, g: 0, b: 0, alpha: 0 } as sharp.Color) {
  const inner = Math.round(size * (1 - 2 * pad));
  const resized = sharp(src).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' });
  const mark = await (size <= 48 ? resized.sharpen({ sigma: 0.5 }) : resized).png().toBuffer(); // a touch of sharpening keeps tab sizes crisp
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }]).png({ compressionLevel: 9 }).toBuffer();
}

// An .ico is a small header plus whole PNG files, one per size.
function ico(images: { size: number; data: Buffer }[]) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size % 256, e);
    head.writeUInt8(size % 256, e + 1);
    head.writeUInt16LE(1, e + 4); // colour planes
    head.writeUInt16LE(32, e + 6); // bits per pixel
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

const files: Record<string, (src: Buffer) => Promise<Buffer>> = {
  'favicon.ico': async (src) => ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(src, size) })))),
  'favicon-16x16.png': (src) => png(src, 16),
  'favicon-32x32.png': (src) => png(src, 32),
  'apple-touch-icon.png': (src) => png(src, 180, 0.12, NIGHT), // iOS fills transparency with black and rounds the corners itself
  'icon-192.png': (src) => png(src, 192, 0.04),
  'icon-512.png': (src) => png(src, 512, 0.04),
};

export const getStaticPaths = (() => Object.keys(files).map((icon) => ({ params: { icon } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const name = params.icon!;
  const type = name.endsWith('.ico') ? 'image/x-icon' : 'image/png';
  return new Response(new Uint8Array(await files[name](await art())), { headers: { 'Content-Type': type } });
};
