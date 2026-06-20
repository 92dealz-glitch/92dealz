const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Inputs and Outputs
const MALE_SRC = 'C:/Users/mugha/.gemini/antigravity-ide/brain/8c14049d-b273-4060-9fa8-cdd5ff07439b/pakistani_male_hero_1780008051051.png';
const FEMALE_SRC = 'C:/Users/mugha/.gemini/antigravity-ide/brain/8c14049d-b273-4060-9fa8-cdd5ff07439b/pakistani_female_hero_1780008189482.png';

const IMAGES_DIR = path.resolve(__dirname, '..', 'public', 'images');
const MALE_OUT = path.join(IMAGES_DIR, 'heroimage6.png'); // male is heroimage6 (front, left)
const FEMALE_OUT = path.join(IMAGES_DIR, 'heroimage5.png'); // female is heroimage5 (back, right)

async function processImage(inputPath, outputPath, isMale) {
  console.log(`Processing: ${inputPath} -> ${outputPath}`);
  
  // Load image raw pixels
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const W = width;
  const H = height;
  const outBuffer = Buffer.alloc(W * H * 4);
  
  // Boundary-aware Flood Fill (BFS)
  const visited = new Uint8Array(W * H);
  const isBackground = new Uint8Array(W * H);
  const queue = [];
  
  // Color distance threshold (Euclidean distance to pure white 255,255,255)
  // AI white backgrounds sometimes have soft shadows or encoding artifacts, so we use a distance threshold.
  const DIST_THRESHOLD = 30; // allows pixels down to ~238 in all channels
  
  function getPixel(x, y) {
    const idx = (y * W + x) * 4;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: data[idx + 3]
    };
  }
  
  function isCloseToWhite(r, g, b) {
    const d = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);
    return d < DIST_THRESHOLD;
  }
  
  // Initialize queue with all boundary pixels
  for (let x = 0; x < W; x++) {
    // Top border
    queue.push({ x, y: 0 });
    visited[0 * W + x] = 1;
    
    // Bottom border (sometimes bottom has shadows, we can include it)
    queue.push({ x, y: H - 1 });
    visited[(H - 1) * W + x] = 1;
  }
  for (let y = 1; y < H - 1; y++) {
    // Left border
    queue.push({ x: 0, y });
    visited[y * W + 0] = 1;
    
    // Right border
    queue.push({ x: W - 1, y });
    visited[y * W + (W - 1)] = 1;
  }
  
  // BFS loop
  let qHead = 0;
  while (qHead < queue.length) {
    const { x, y } = queue[qHead++];
    const idx = y * W + x;
    const pixel = getPixel(x, y);
    
    if (isCloseToWhite(pixel.r, pixel.g, pixel.b)) {
      isBackground[idx] = 1;
      
      // Check 4 neighbors
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
      ];
      
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < W && n.y >= 0 && n.y < H) {
          const nIdx = n.y * W + n.x;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            queue.push(n);
          }
        }
      }
    }
  }
  
  // Additional safety pass: Any isolated pixel on the top/sides that is extremely white
  // can be removed even if not connected, but BFS handles 99% of it.
  
  // Bottom Fade Out Height (bottom 12% of the image)
  const FADE_HEIGHT = Math.round(H * 0.12);
  const FADE_START_Y = H - FADE_HEIGHT;
  
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const pixelIdx = y * W + x;
      
      if (isBackground[pixelIdx]) {
        // Transparent background
        outBuffer[idx] = 0;
        outBuffer[idx + 1] = 0;
        outBuffer[idx + 2] = 0;
        outBuffer[idx + 3] = 0;
      } else {
        // Keep original colors
        outBuffer[idx] = data[idx];
        outBuffer[idx + 1] = data[idx + 1];
        outBuffer[idx + 2] = data[idx + 2];
        
        let alpha = data[idx + 3];
        
        // Soft bottom fade
        if (y >= FADE_START_Y) {
          const distanceIntoFade = y - FADE_START_Y;
          const fadeFactor = 1 - (distanceIntoFade / FADE_HEIGHT);
          alpha = Math.round(alpha * fadeFactor);
        }
        
        outBuffer[idx + 3] = alpha;
      }
    }
  }
  
  // Save output using sharp and apply trim to auto-crop excess transparency
  await sharp(outBuffer, {
    raw: {
      width: W,
      height: H,
      channels: 4
    }
  })
  .trim() // automatically trims excess transparent margins
  .png({ compressionLevel: 9, quality: 95 })
  .toFile(outputPath);
  
  console.log(`✅ Success processing ${outputPath}`);
}

(async () => {
  try {
    // Process Pakistani Male -> heroimage6.png (front, left)
    await processImage(MALE_SRC, MALE_OUT, true);
    
    // Process Pakistani Female -> heroimage5.png (back, right)
    await processImage(FEMALE_SRC, FEMALE_OUT, false);
    
    console.log('🎉 Background removal and bottom fade completed successfully for both images!');
  } catch (err) {
    console.error('❌ Processing failed:', err);
    process.exit(1);
  }
})();
