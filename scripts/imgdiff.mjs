// Pixel-diff two same-size PNGs → prints % of pixels differing beyond a threshold
// and writes a heatmap (differing pixels tinted red over a dimmed base).
// Usage: node scripts/imgdiff.mjs <figma.png> <render.png> <out-heatmap.png> [threshold]
import sharp from 'sharp';
const [, , aPath, bPath, outPath, thrArg] = process.argv;
const THR = Number(thrArg ?? 32); // per-channel abs diff to count as "different"
const a = sharp(aPath).ensureAlpha();
const am = await a.metadata();
// Resize render to figma dimensions so they overlay 1:1.
const aRaw = await sharp(aPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const bRaw = await sharp(bPath).resize(am.width, am.height, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data: A, info } = aRaw;
const { data: B } = bRaw;
const W = info.width, H = info.height, C = info.channels;
const out = Buffer.alloc(W * H * 4);
let diff = 0, total = W * H;
for (let i = 0, p = 0; i < A.length; i += C, p += 4) {
  const dr = Math.abs(A[i] - B[i]), dg = Math.abs(A[i + 1] - B[i + 1]), db = Math.abs(A[i + 2] - B[i + 2]);
  const d = Math.max(dr, dg, db);
  const isDiff = d > THR;
  if (isDiff) diff++;
  // heatmap: differing = red, same = dimmed grayscale of figma
  if (isDiff) { out[p] = 255; out[p + 1] = 40; out[p + 2] = 40; out[p + 3] = 255; }
  else { const g = (A[i] * 0.3 + A[i + 1] * 0.59 + A[i + 2] * 0.11) * 0.5 + 90; out[p] = out[p + 1] = out[p + 2] = g; out[p + 3] = 255; }
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(outPath);
console.log(JSON.stringify({ dims: `${W}x${H}`, diffPixels: diff, totalPixels: total, pctDiff: +(100 * diff / total).toFixed(2), threshold: THR, heatmap: outPath }));
