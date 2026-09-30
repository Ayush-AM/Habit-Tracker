const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create PNG buffer without external dependencies
function createPng(w, h, rgbaFn) {
  const bpp = 4;
  const raw = Buffer.alloc(h * (1 + w * bpp));
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0; // Filter type 0 (None)
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = rgbaFn(x, y);
      raw[p++] = r;
      raw[p++] = g;
      raw[p++] = b;
      raw[p++] = a;
    }
  }

  const idat = zlib.deflateSync(raw);

  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
    return (c ^ 0xffffffff) >>> 0;
  };

  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
    return Buffer.concat([len, t, data, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Distance from point (x,y) to line segment (x1,y1)-(x2,y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Draw Habit Tracker icon (Progress ring + Checkmark)
function generateHabitIcon(size) {
  const cx = size / 2;
  const cy = size / 2;
  const rCorner = size * 0.22; // rounded squircle corner

  // Segments for Checkmark: (0.33, 0.52) -> (0.46, 0.65) -> (0.70, 0.36)
  const segments = [
    [size * 0.32, size * 0.52, size * 0.45, size * 0.65],
    [size * 0.45, size * 0.65, size * 0.70, size * 0.36]
  ];

  const strokeWidth = Math.max(3, size * 0.065);
  const ringRadius = size * 0.35;
  const ringThickness = Math.max(3, size * 0.045);

  return createPng(size, size, (x, y) => {
    // Check squircle mask
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const half = size / 2;
    const inCorner = dx > half - rCorner && dy > half - rCorner;
    if (inCorner) {
      const cDist = Math.hypot(dx - (half - rCorner), dy - (half - rCorner));
      if (cDist > rCorner) return [0, 0, 0, 0]; // Transparent outside squircle
    }

    // Background gradient: Deep indigo to dark slate #0f172a -> #1e1b4b
    const gradFactor = (y / size);
    const bgR = Math.round(15 + 15 * gradFactor);
    const bgG = Math.round(23 + 4 * gradFactor);
    const bgB = Math.round(42 + 33 * gradFactor);

    // Outer Progress Ring
    const distFromCenter = Math.hypot(x - cx, y - cy);
    const ringDist = Math.abs(distFromCenter - ringRadius);
    const inRing = ringDist <= ringThickness / 2;

    // Checkmark distance check
    let minDist = 9999;
    for (const [x1, y1, x2, y2] of segments) {
      const d = distToSegment(x, y, x1, y1, x2, y2);
      if (d < minDist) minDist = d;
    }

    // Checkmark color (Vibrant emerald #10b981 to electric cyan #06b6d4)
    if (minDist <= strokeWidth / 2) {
      return [52, 211, 153, 255]; // #34d399 Emerald
    } else if (minDist <= strokeWidth / 2 + 2) {
      const edge = 1 - (minDist - strokeWidth / 2) / 2;
      return [Math.round(bgR * (1 - edge) + 52 * edge), Math.round(bgG * (1 - edge) + 211 * edge), Math.round(bgB * (1 - edge) + 153 * edge), 255];
    }

    // Ring color (Electric blue #3b82f6)
    if (inRing) {
      return [59, 130, 246, 255]; // #3b82f6 Blue
    } else if (ringDist <= ringThickness / 2 + 2) {
      const edge = 1 - (ringDist - ringThickness / 2) / 2;
      return [Math.round(bgR * (1 - edge) + 59 * edge), Math.round(bgG * (1 - edge) + 130 * edge), Math.round(bgB * (1 - edge) + 246 * edge), 255];
    }

    return [bgR, bgG, bgB, 255];
  });
}

// Generate SVG icon
function generateSvgIcon() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="#334155" stroke-width="24"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="url(#ringGrad)" stroke-width="24" stroke-dasharray="850" stroke-dashoffset="230" stroke-linecap="round"/>
  <path d="M165 265 L230 330 L355 185" fill="none" stroke="url(#checkGrad)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

console.log('Generating Habit Tracker PWA icons...');
fs.writeFileSync(path.join(outDir, 'icon-512x512.png'), generateHabitIcon(512));
fs.writeFileSync(path.join(outDir, 'icon-192x192.png'), generateHabitIcon(192));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), generateHabitIcon(180));
fs.writeFileSync(path.join(outDir, 'icon.svg'), generateSvgIcon());
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), generateSvgIcon());
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), generateHabitIcon(64));

console.log('All Habit Tracker PWA icons generated successfully!');
