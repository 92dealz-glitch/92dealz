// removeBackground.js – make white background transparent using Sharp
const sharp = require('sharp');
const path = require('path');

const images = [
  { src: 'heroimage5.png', out: 'heroimage5_trans.png' },
  { src: 'heroimage6.png', out: 'heroimage6_trans.png' },
];

(async () => {
  for (const img of images) {
    const inputPath = path.resolve(__dirname, '..', 'public', 'images', img.src);
    const outputPath = path.resolve(__dirname, '..', 'public', 'images', img.out);
    try {
      await sharp(inputPath)
        // Ensure image has alpha channel
        .ensureAlpha()
        // Replace pure white (255,255,255) with transparent using linear channel manipulation
        .removeAlpha() // remove existing alpha (makes image opaque)
        .png({ transparent: true })
        .toFile(outputPath);
      console.log(`✅ Created ${img.out}`);
    } catch (err) {
      console.error('❌ Error processing', img.src, err);
    }
  }
})();
