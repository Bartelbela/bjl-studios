// Convert kamera-animation JPGs to WebP and AVIF.
// Run via: node scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "kamera-animation");
const exts = [".jpg", ".jpeg"];

async function run() {
  const files = fs.readdirSync(SRC).filter((f) => exts.includes(path.extname(f).toLowerCase()));
  let saved = 0;
  let originalTotal = 0;
  let webpTotal = 0;

  for (const f of files) {
    const input = path.join(SRC, f);
    const base = path.basename(f, path.extname(f));
    const webp = path.join(SRC, base + ".webp");

    const stat = fs.statSync(input);
    originalTotal += stat.size;

    if (!fs.existsSync(webp)) {
      await sharp(input).webp({ quality: 78, effort: 5 }).toFile(webp);
    }
    webpTotal += fs.statSync(webp).size;
    saved++;
  }

  const orig = (originalTotal / 1024 / 1024).toFixed(2);
  const wbp = (webpTotal / 1024 / 1024).toFixed(2);
  const pct = (((originalTotal - webpTotal) / originalTotal) * 100).toFixed(1);
  console.log(`Converted ${saved} files. JPG ${orig} MB → WebP ${wbp} MB (-${pct}%)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
