/**
 * Capture screenshots of Golden Sun Vale Village game
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  const baseUrl = 'file://' + path.resolve(__dirname, 'golden-sun');
  console.log('📸 Capturing Golden Sun screenshots...');

  try {
    // 1. Launch the game
    console.log('Loading game...');
    await page.goto(`${baseUrl}/dist/index.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // Wait for game to initialize
    await page.waitForTimeout(2000);

    // Check if game loaded successfully
    const errorVisible = await page.isVisible('.error-screen').catch(() => false);
    if (errorVisible) {
      console.error('❌ Game failed to load - error screen visible');
      const errorText = await page.textContent('.error-screen').catch(() => 'Unknown error');
      console.error('Error:', errorText);
    } else {
      console.log('✅ Game loaded successfully');
    }

    // Capture initial state
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-game-initial.png'),
      fullPage: false
    });
    console.log('✅ Saved: golden-sun-game-initial.png');

    // Simulate movement
    console.log('Simulating player movement...');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-game-moved.png'),
      fullPage: false
    });
    console.log('✅ Saved: golden-sun-game-moved.png');

    // Try to interact with NPC (move toward spawn then press Enter)
    console.log('Attempting NPC interaction...');
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(800);
    await page.keyboard.up('ArrowUp');
    await page.waitForTimeout(300);
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Check if dialogue appeared
    const dialogueVisible = await page.isVisible('.dialogue-box').catch(() => false);
    if (dialogueVisible) {
      console.log('✅ Dialogue box visible!');
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-game-dialogue.png'),
        fullPage: false
      });
      console.log('✅ Saved: golden-sun-game-dialogue.png');
    } else {
      console.log('ℹ️  No dialogue triggered yet');
    }

    // Capture preview page
    console.log('Capturing preview page...');
    await page.goto(`${baseUrl}/preview.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-preview.png'),
      fullPage: true
    });
    console.log('✅ Saved: golden-sun-preview.png');

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error.message);
    
    // Try to capture error state
    try {
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-error-state.png'),
        fullPage: true
      });
      console.log('📸 Saved error state screenshot');
    } catch (e) {
      console.error('Could not capture error state');
    }
  } finally {
    await browser.close();
    console.log('\n✅ Screenshot capture complete!');
  }
}

captureScreenshots().catch(console.error);
