/**
 * Capture screenshots from HTTP server
 */

const { chromium } = require('playwright');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log('📸 Capturing Golden Sun screenshots from HTTP server...');

  try {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Loading game from: http://localhost:8080');
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait for game initialization
    console.log('Waiting for game to initialize...');
    await page.waitForTimeout(4000);

    // Check what's on the page
    const hasTitle = await page.isVisible('.game-title').catch(() => false);
    const hasViewport = await page.isVisible('.game-viewport').catch(() => false);
    const hasError = await page.isVisible('.error-screen').catch(() => false);
    const hasLoading = await page.isVisible('.loading-screen').catch(() => false);

    console.log('Element visibility:');
    console.log('  ✓ Title:', hasTitle);
    console.log('  ✓ Viewport:', hasViewport);
    console.log('  ✗ Error:', hasError);
    console.log('  ⏳ Loading:', hasLoading);

    if (hasError) {
      const errorText = await page.textContent('.error-screen').catch(() => 'Unknown');
      console.error('❌ Error on page:', errorText);
    }

    // Capture initial state
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-react-game.png'),
      fullPage: false
    });
    console.log('✅ Saved: golden-sun-react-game.png');

    // If game loaded successfully, try interactions
    if (hasViewport && !hasError && !hasLoading) {
      console.log('Game loaded! Trying movement...');
      
      // Move right
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-player-moved.png'),
        fullPage: false
      });
      console.log('✅ Saved: golden-sun-player-moved.png');

      // Move up to find an NPC
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(300);
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(300);
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(500);

      // Try to interact
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      const hasDialogue = await page.isVisible('.dialogue-box').catch(() => false);
      if (hasDialogue) {
        console.log('✅ Dialogue appeared!');
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots/golden-sun-dialogue-active.png'),
          fullPage: false
        });
        console.log('✅ Saved: golden-sun-dialogue-active.png');
      } else {
        console.log('ℹ️  No dialogue triggered');
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots/golden-sun-no-dialogue.png'),
          fullPage: false
        });
        console.log('✅ Saved: golden-sun-no-dialogue.png');
      }
    } else if (hasLoading) {
      console.log('⏳ Game still loading...');
      await page.waitForTimeout(3000);
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-still-loading.png'),
        fullPage: false
      });
      console.log('✅ Saved: golden-sun-still-loading.png');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    try {
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-capture-error.png'),
        fullPage: true
      });
      console.log('📸 Saved error screenshot');
    } catch (e) {
      // Ignore
    }
  } finally {
    await browser.close();
    console.log('\n✅ Screenshot capture complete!');
  }
}

captureScreenshots().catch(console.error);
