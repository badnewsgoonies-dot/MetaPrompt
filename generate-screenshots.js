const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// List of all mockup HTML files to screenshot
const mockupFiles = [
  // Mockup examples
  { path: './mockup-examples/djinn-menu/djinn-menu.html', name: 'djinn-menu' },
  { path: './mockup-examples/golden-sun-battle/golden-sun-battle.html', name: 'golden-sun-battle' },
  { path: './mockup-examples/overworld-ice-cave/overworld-ice-cave.html', name: 'overworld-ice-cave' },
  { path: './mockup-examples/overworld-palace/overworld-palace.html', name: 'overworld-palace' },
  { path: './mockup-examples/overworld-temple/overworld-temple.html', name: 'overworld-temple' },
  { path: './mockup-examples/overworld-village/overworld-village.html', name: 'overworld-village' },
  
  // Isaac clone
  { path: './isaac-clone/mockups/vale-village.html', name: 'isaac-vale-village' },
  { path: './isaac-clone/mockup.html', name: 'isaac-mockup' },
  { path: './isaac-clone/index.html', name: 'isaac-index' },
  
  // Pokemon battler
  { path: './pokemon-battler/mockups/battle-screen.html', name: 'pokemon-battle-screen' },
  { path: './pokemon-battler/index.html', name: 'pokemon-index' },
  
  // Tower defense
  { path: './tower-defense/mockup/game-screen.html', name: 'tower-defense-game-screen' },
  { path: './tower-defense/index.html', name: 'tower-defense-index' },
  
  // Yugioh simulator
  { path: './yugioh-simulator/demo.html', name: 'yugioh-demo' },
  
  // Root level mockups
  { path: './golden-sun-mockup.html', name: 'golden-sun-mockup' },
  { path: './golden-sun-battle-pixel-perfect.html', name: 'golden-sun-battle-pixel-perfect' },
];

async function generateScreenshots() {
  const outputDir = path.join(__dirname, 'screenshots');
  
  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Starting screenshot generation...');
  console.log(`Output directory: ${outputDir}\n`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const mockup of mockupFiles) {
    const fullPath = path.resolve(__dirname, mockup.path);
    const screenshotPath = path.join(outputDir, `${mockup.name}.png`);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${mockup.name}: File not found at ${mockup.path}`);
      errorCount++;
      continue;
    }
    
    try {
      console.log(`📸 Capturing ${mockup.name}...`);
      await page.goto(`file://${fullPath}`, { waitUntil: 'networkidle' });
      
      // Wait a bit for any animations or dynamic content to load
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false
      });
      
      console.log(`✅ Saved: ${screenshotPath}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error capturing ${mockup.name}:`, error.message);
      errorCount++;
    }
  }
  
  await browser.close();
  
  console.log('\n=================================');
  console.log('Screenshot generation complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Screenshots saved to: ${outputDir}`);
  console.log('=================================\n');
}

generateScreenshots().catch(console.error);
