// Generate the Open Graph image (1200×630) used for social sharing.
// Run via: node scripts/generate-og-image.js
const sharp = require("sharp");
const path = require("path");

const OUT = path.join(__dirname, "..", "assets", "og-image.png");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060606"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Hairlines -->
  <line x1="80" y1="80" x2="1120" y2="80" stroke="#1a1a1a" stroke-width="1"/>
  <line x1="80" y1="550" x2="1120" y2="550" stroke="#1a1a1a" stroke-width="1"/>

  <!-- Top label -->
  <text x="80" y="60" font-family="Inter, sans-serif" font-size="14" letter-spacing="6"
        fill="#60A5FA" font-weight="500">DIGITALAGENTUR · MÖNCHENGLADBACH</text>

  <!-- Logo strikes -->
  <g transform="translate(80,180)">
    <path d="M0 130L40 0h16L16 130H0z" fill="#60A5FA"/>
    <path d="M32 130L72 0h16L48 130H32z" fill="#60A5FA"/>
    <path d="M64 130L104 0h16L80 130H64z" fill="#60A5FA"/>
  </g>

  <!-- Wordmark -->
  <text x="240" y="270" font-family="'Archivo Black', Inter, sans-serif" font-size="120"
        fill="#FFFFFF" font-weight="900" letter-spacing="-2">BJL</text>
  <text x="240" y="320" font-family="Inter, sans-serif" font-size="22"
        fill="#a0a0a0" letter-spacing="14" font-weight="300">STUDIOS</text>

  <!-- Tagline -->
  <text x="80" y="440" font-family="'Archivo Black', Inter, sans-serif" font-size="56"
        fill="#FFFFFF" font-weight="900" letter-spacing="-1">Digital denken.</text>
  <text x="80" y="500" font-family="'Archivo Black', Inter, sans-serif" font-size="56"
        fill="#60A5FA" font-weight="900" letter-spacing="-1">Lokal wachsen.</text>

  <!-- Bottom row -->
  <text x="80" y="595" font-family="Inter, sans-serif" font-size="18"
        fill="#a0a0a0" font-weight="400">Web · SEO · Social · Branding · Video</text>
  <text x="1120" y="595" font-family="Inter, sans-serif" font-size="18"
        fill="#a0a0a0" font-weight="500" text-anchor="end">bjl-studios.de</text>
</svg>`;

(async () => {
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(OUT);
  console.log("OG image written to", OUT);
})();
