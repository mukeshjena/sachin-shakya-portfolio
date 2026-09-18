import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Builds a valid multi-frame ICO file from an array of PNG buffers.
 * Google Search Console, Edge, Safari, and modern desktop browsers expect
 * 16x16, 32x32, and 48x48 frames embedded within a single binary ICO container.
 */
function createMultiResolutionIco(
  frames: Array<{ width: number; height: number; buffer: Buffer }>
): Buffer {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const directorySize = count * 16;
  let currentOffset = 6 + directorySize;

  const directoryEntries: Buffer[] = [];
  const imageBuffers: Buffer[] = [];

  for (const frame of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(frame.width >= 256 ? 0 : frame.width, 0);
    entry.writeUInt8(frame.height >= 256 ? 0 : frame.height, 1);
    entry.writeUInt8(0, 2); // No color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(frame.buffer.length, 8); // Image data length
    entry.writeUInt32LE(currentOffset, 12); // Data offset

    directoryEntries.push(entry);
    imageBuffers.push(frame.buffer);
    currentOffset += frame.buffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
}

/**
 * Generates all Favicon, Touch Icon, PWA, and OpenGraph assets for Sachin Shakya's portfolio.
 */
async function generateAllSeoAssets() {
  const rootDir = process.cwd();
  const publicDir = path.resolve(rootDir, "public");
  const pwaDir = path.resolve(publicDir, "pwa-icons");
  const assetsDir = path.resolve(publicDir, "assets");

  if (!fs.existsSync(pwaDir)) {
    fs.mkdirSync(pwaDir, { recursive: true });
  }

  const logoPath = path.resolve(assetsDir, "sachin-logo.png");
  const photoPath = path.resolve(assetsDir, "sachin-one.png");

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Source logo not found at: ${logoPath}`);
  }

  console.log("===============================================================");
  console.log("🚀 Sachin Shakya Portfolio - Professional Icon & OG Generator");
  console.log("===============================================================");

  // 1. Google Search Console & Standard Browser Favicon Sizes
  const standardFaviconSizes = [16, 32, 48, 96, 144, 192];
  const icoFrames: Array<{ width: number; height: number; buffer: Buffer }> = [];

  console.log("\n[1/5] Generating Google Search Console & Browser Favicon PNGs...");
  for (const size of standardFaviconSizes) {
    const pngBuffer = await sharp(logoPath)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const filename = `favicon-${size}x${size}.png`;
    fs.writeFileSync(path.resolve(publicDir, filename), pngBuffer);
    console.log(`  ✓ Generated: public/${filename} (${size}x${size})`);

    if (size === 16 || size === 32 || size === 48) {
      icoFrames.push({ width: size, height: size, buffer: pngBuffer });
    }
  }

  // 2. Multi-Resolution Binary favicon.ico (16, 32, 48px)
  console.log("\n[2/5] Generating Multi-Resolution Binary favicon.ico (16, 32, 48px)...");
  const multiIcoBuffer = createMultiResolutionIco(icoFrames);
  fs.writeFileSync(path.resolve(publicDir, "favicon.ico"), multiIcoBuffer);
  console.log(
    `  ✓ Generated: public/favicon.ico (${multiIcoBuffer.length} bytes, 3 embedded resolutions)`
  );

  // 3. Apple Touch Icons (180x180)
  console.log("\n[3/5] Generating Apple Touch Icons...");
  const appleTouchSize = 180;
  const appleTouchBuffer = await sharp(logoPath)
    .resize(appleTouchSize, appleTouchSize, {
      fit: "contain",
      background: { r: 6, g: 18, b: 26, alpha: 1 }, // --ink-900 background
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.resolve(publicDir, "apple-touch-icon.png"), appleTouchBuffer);
  fs.writeFileSync(path.resolve(publicDir, "apple-touch-icon-precomposed.png"), appleTouchBuffer);
  console.log("  ✓ Generated: public/apple-touch-icon.png (180x180)");
  console.log("  ✓ Generated: public/apple-touch-icon-precomposed.png (180x180)");

  // 4. Android Chrome & PWA Icons
  console.log("\n[4/5] Generating Android Chrome & PWA Icons...");
  const chrome192 = await sharp(logoPath)
    .resize(192, 192, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.resolve(publicDir, "icon-192x192.png"), chrome192);
  fs.writeFileSync(path.resolve(publicDir, "android-chrome-192x192.png"), chrome192);
  fs.writeFileSync(path.resolve(pwaDir, "icon-192.png"), chrome192);

  const chrome512 = await sharp(logoPath)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.resolve(publicDir, "icon-512x512.png"), chrome512);
  fs.writeFileSync(path.resolve(publicDir, "android-chrome-512x512.png"), chrome512);
  fs.writeFileSync(path.resolve(pwaDir, "icon-512.png"), chrome512);

  // Maskable icon with safe zone padding
  const maskableInner = await sharp(logoPath)
    .resize(410, 410, {
      fit: "contain",
      background: { r: 6, g: 18, b: 26, alpha: 1 },
    })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 6, g: 18, b: 26, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.resolve(pwaDir, "icon-512-maskable.png"), maskableInner);
  console.log("  ✓ Generated: public/icon-192x192.png & public/icon-512x512.png");
  console.log("  ✓ Generated: public/pwa-icons/ (192, 512, 512-maskable)");

  // 5. Bespoke Executive Sci-Fi Telemetry OpenGraph Image (1200x630)
  console.log("\n[5/5] Generating Bespoke Executive OpenGraph Image (1200x630)...");

  // Resize logo for OG container (180x180)
  const ogLogoBuffer = await sharp(logoPath)
    .resize(160, 160, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const ogLogoBase64 = `data:image/png;base64,${ogLogoBuffer.toString("base64")}`;

  // Process portrait photo for visual presence if available
  let photoSvgElement = "";
  if (fs.existsSync(photoPath)) {
    const photoBuffer = await sharp(photoPath)
      .resize(260, 320, {
        fit: "cover",
        position: "top",
      })
      .png()
      .toBuffer();
    const photoBase64 = `data:image/png;base64,${photoBuffer.toString("base64")}`;
    photoSvgElement = `
      <g transform="translate(860, 115)">
        <defs>
          <clipPath id="avatarClip">
            <rect x="0" y="0" width="240" height="300" rx="16" />
          </clipPath>
        </defs>
        <!-- Photo Frame Outer -->
        <rect x="-3" y="-3" width="246" height="306" rx="18" fill="#08171f" stroke="rgba(130,180,200,0.22)" stroke-width="1.5" />
        <image href="${photoBase64}" x="0" y="0" width="240" height="300" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)" />
        <rect x="0" y="0" width="240" height="300" rx="16" fill="none" stroke="rgba(255,176,32,0.3)" stroke-width="1.5" />
        <!-- Bottom Tag on Avatar -->
        <g transform="translate(16, 258)">
          <rect x="0" y="0" width="208" height="28" rx="6" fill="#06121a" stroke="rgba(130,180,200,0.25)" stroke-width="1" />
          <circle cx="14" cy="14" r="4" fill="#3fd08a" />
          <text x="26" y="18" class="font-mono" font-size="10.5" font-weight="600" fill="#e8f1f4" letter-spacing="1">VERIFIED ARCHITECT</text>
        </g>
      </g>
    `;
  }

  const svgWidth = 1200;
  const svgHeight = 630;

  const svg = `
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Sci-Fi Petrol Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06121a" />
      <stop offset="50%" stop-color="#08171f" />
      <stop offset="100%" stop-color="#0b1d27" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1d27" />
      <stop offset="100%" stop-color="#102a36" />
    </linearGradient>
    <linearGradient id="amberLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffb020" />
      <stop offset="50%" stop-color="#49c7e8" />
      <stop offset="100%" stop-color="#ffb020" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e8f1f4" />
    </linearGradient>
  </defs>

  <style>
    .font-heavy { font-family: -apple-system, BlinkMacSystemFont, "Archivo", "Segoe UI", Roboto, sans-serif; font-weight: 800; }
    .font-bold { font-family: -apple-system, BlinkMacSystemFont, "Archivo", "Segoe UI", Roboto, sans-serif; font-weight: 700; }
    .font-medium { font-family: -apple-system, BlinkMacSystemFont, "IBM Plex Sans", "Segoe UI", Roboto, sans-serif; font-weight: 500; }
    .font-mono { font-family: "IBM Plex Mono", "SF Mono", "Segoe UI Mono", Menlo, monospace; }
  </style>

  <!-- Deep Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Outer Ambient Hairline Border -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="rgba(130,180,200,0.18)" stroke-width="1.5" />

  <!-- Top Accent Horizon Line -->
  <line x1="24" y1="24" x2="1176" y2="24" stroke="url(#amberLine)" stroke-width="3" />

  <!-- Architectural Corner Crosshairs -->
  <g stroke="rgba(130,180,200,0.35)" stroke-width="1.5">
    <path d="M 44 48 L 56 48 M 50 42 L 50 54" />
    <path d="M 1144 48 L 1156 48 M 1150 42 L 1150 54" />
    <path d="M 44 578 L 56 578 M 50 572 L 50 584" />
    <path d="M 1144 578 L 1156 578 M 1150 572 L 1150 584" />
  </g>

  <!-- Left Header & Identity Container -->
  <g transform="translate(68, 62)">
    <!-- Brand Logo Mark & Live Status Pill -->
    <g transform="translate(0, 0)">
      <!-- Logo Container -->
      <rect x="0" y="0" width="72" height="72" rx="14" fill="#0b1d27" stroke="rgba(130,180,200,0.22)" stroke-width="1.5" />
      <image href="${ogLogoBase64}" x="8" y="8" width="56" height="56" preserveAspectRatio="xMidYMid meet" />

      <!-- Status Beacon Badge -->
      <g transform="translate(88, 18)">
        <rect x="0" y="0" width="370" height="34" rx="17" fill="#0b1d27" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <circle cx="18" cy="17" r="4.5" fill="#3fd08a" />
        <text x="32" y="22" class="font-mono" font-size="11.5" font-weight="600" fill="#3fd08a" letter-spacing="2">ACTIVE CLOUD INFRASTRUCTURE</text>
      </g>
    </g>

    <!-- Main Title -->
    <text x="0" y="132" class="font-heavy" font-size="52" fill="url(#textGrad)" letter-spacing="-1.5">SACHIN SHAKYA</text>

    <!-- Professional Role Subtitle -->
    <text x="2" y="168" class="font-bold" font-size="20" fill="#ffb020" letter-spacing="2">LEAD CLOUDOPS &amp; DEVOPS ARCHITECT</text>

    <!-- Executive Value Summary -->
    <text x="2" y="206" class="font-medium" font-size="16" fill="#93aeba" letter-spacing="0.2">
      Enterprise Multi-Cloud Infrastructure, Automated FinOps, and SRE Systems.
    </text>
    <text x="2" y="230" class="font-medium" font-size="16" fill="#93aeba" letter-spacing="0.2">
      Engineered for mission-critical enterprise resilience and scalable autonomy.
    </text>

    <!-- Telemetry Cards Grid (4 KPI Pillars) -->
    <g transform="translate(0, 260)">
      <!-- Metric 1: Cost Optimization -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="180" height="88" rx="12" fill="#0b1d27" stroke="rgba(130,180,200,0.18)" stroke-width="1" />
        <text x="16" y="38" class="font-mono font-bold" font-size="24" fill="#ffb020" letter-spacing="-0.5">$170K/mo</text>
        <text x="16" y="66" class="font-mono" font-size="11" fill="#93aeba" letter-spacing="1">COST OPTIMIZATION</text>
      </g>

      <!-- Metric 2: MTTR Reduction -->
      <g transform="translate(192, 0)">
        <rect x="0" y="0" width="180" height="88" rx="12" fill="#0b1d27" stroke="rgba(130,180,200,0.18)" stroke-width="1" />
        <text x="16" y="38" class="font-mono font-bold" font-size="24" fill="#49c7e8" letter-spacing="-0.5">40% MTTR</text>
        <text x="16" y="66" class="font-mono" font-size="11" fill="#93aeba" letter-spacing="1">FASTER RECOVERY</text>
      </g>

      <!-- Metric 3: Managed Resources -->
      <g transform="translate(384, 0)">
        <rect x="0" y="0" width="180" height="88" rx="12" fill="#0b1d27" stroke="rgba(130,180,200,0.18)" stroke-width="1" />
        <text x="16" y="38" class="font-mono font-bold" font-size="24" fill="#ffffff" letter-spacing="-0.5">2,000+</text>
        <text x="16" y="66" class="font-mono" font-size="11" fill="#93aeba" letter-spacing="1">CLOUD RESOURCES</text>
      </g>

      <!-- Metric 4: High Availability -->
      <g transform="translate(576, 0)">
        <rect x="0" y="0" width="180" height="88" rx="12" fill="#0b1d27" stroke="rgba(130,180,200,0.18)" stroke-width="1" />
        <text x="16" y="38" class="font-mono font-bold" font-size="24" fill="#3fd08a" letter-spacing="-0.5">99.99%</text>
        <text x="16" y="66" class="font-mono" font-size="11" fill="#93aeba" letter-spacing="1">SLA RELIABILITY</text>
      </g>
    </g>

    <!-- Cloud Platform Badges -->
    <g transform="translate(2, 372)">
      <text x="0" y="14" class="font-mono" font-size="12" font-weight="600" fill="#6b8896" letter-spacing="1.5">STACK:</text>
      
      <g transform="translate(68, 0)">
        <rect x="0" y="0" width="68" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="14" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">AWS</text>
      </g>

      <g transform="translate(144, 0)">
        <rect x="0" y="0" width="80" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="14" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">AZURE</text>
      </g>

      <g transform="translate(232, 0)">
        <rect x="0" y="0" width="68" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="16" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">GCP</text>
      </g>

      <g transform="translate(308, 0)">
        <rect x="0" y="0" width="112" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="12" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">KUBERNETES</text>
      </g>

      <g transform="translate(428, 0)">
        <rect x="0" y="0" width="102" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="12" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">TERRAFORM</text>
      </g>

      <g transform="translate(538, 0)">
        <rect x="0" y="0" width="88" height="24" rx="6" fill="#102a36" stroke="rgba(130,180,200,0.2)" stroke-width="1" />
        <text x="12" y="16" class="font-mono" font-size="11" font-weight="600" fill="#e8f1f4">DATADOG</text>
      </g>
    </g>
  </g>

  <!-- Right Column: Optional Photo Card -->
  ${photoSvgElement}

  <!-- Bottom Dividing Hairline -->
  <line x1="24" y1="520" x2="1176" y2="520" stroke="rgba(130,180,200,0.16)" stroke-width="1" />

  <!-- Bottom Telemetry Footer -->
  <g transform="translate(68, 564)">
    <text x="0" y="0" class="font-mono font-bold" font-size="18" fill="#ffffff" letter-spacing="1">shakya.mukeshjena.com</text>
    <text x="260" y="-1" class="font-medium" font-size="13" fill="#6b8896">| Enterprise Cloud Engineering &amp; Autonomous Telemetry</text>

    <text x="1064" y="0" class="font-mono" font-size="12" fill="#93aeba" text-anchor="end" letter-spacing="1">
      EPTURA • LTIMINDTREE • TCS • DOWNER • ABN AMRO
    </text>
  </g>
</svg>
`;

  const svgBuffer = Buffer.from(svg.trim());

  // Render high-res PNG at 1200x630
  const ogPngBuffer = await sharp(svgBuffer).png({ compressionLevel: 8 }).toBuffer();

  const ogOutputPath = path.resolve(publicDir, "og-image.png");
  fs.writeFileSync(ogOutputPath, ogPngBuffer);
  console.log(`  ✓ Generated: public/og-image.png (${ogPngBuffer.length} bytes, 1200x630)`);

  // Also render high-quality JPEG for maximum social card compatibility
  const ogJpegBuffer = await sharp(svgBuffer)
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toBuffer();

  fs.writeFileSync(path.resolve(publicDir, "og-image.jpg"), ogJpegBuffer);
  fs.writeFileSync(path.resolve(publicDir, "twitter-image.jpg"), ogJpegBuffer);
  console.log(`  ✓ Generated: public/og-image.jpg & public/twitter-image.jpg (1200x630)`);

  console.log("\n✨ All SEO Icons and OpenGraph assets generated successfully!");
}

generateAllSeoAssets().catch((err) => {
  console.error("❌ Failed to generate SEO assets:", err);
  process.exit(1);
});
