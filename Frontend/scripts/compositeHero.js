// compositeHero.js – create composite hero banner using Sharp with resizing
const sharp = require('sharp');
const path = require('path');

// Paths (relative to this script file)
const manPath = path.resolve(__dirname, '..', 'public', 'images', 'heroimage6.png'); // man (green kurta)
const womanPath = path.resolve(__dirname, '..', 'public', 'images', 'heroimage5.png'); // woman (bags)
const outputPath = path.resolve(__dirname, '..', 'public', 'images', 'hero_banner.png');

(async () => {
  try {
    // Load woman's metadata (will be the base canvas)
    const womanMeta = await sharp(womanPath).metadata();

    // Load and optionally resize man to fit within woman's dimensions
    const manSharp = sharp(manPath);
    const manMeta = await manSharp.metadata();
    let manResized;
    if (manMeta.width > womanMeta.width || manMeta.height > womanMeta.height) {
      // Resize preserving aspect ratio so it fits inside woman's canvas
      manResized = await manSharp
        .resize({ width: womanMeta.width, height: womanMeta.height, fit: 'inside' })
        .png()
        .toBuffer();
    } else {
      // No resizing needed
      manResized = await manSharp.png().toBuffer();
    }

    // Load woman image as buffer (preserve any transparency)
    const womanBuffer = await sharp(womanPath).png().toBuffer();

    // Compute overlap offset (15% of woman's width)
    const offsetLeft = Math.round(womanMeta.width * 0.15);

    // Composite: woman as background, man on top with slight overlap on left side
    await sharp(womanBuffer)
      .composite([
        { input: manResized, left: -offsetLeft, top: 0 },
      ])
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log('✅ hero_banner.png created at', outputPath);
  } catch (err) {
    console.error('❌ Error creating hero banner:', err);
    process.exit(1);
  }
})();
