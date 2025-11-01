/**
 * Improved screenshot capture with longer wait times
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
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  const baseUrl = 'file://' + path.resolve(__dirname, 'golden-sun');
  console.log('📸 Capturing Golden Sun screenshots with extended wait times...');

  try {
    console.log('Loading game from:', `${baseUrl}/dist/index.html`);
    await page.goto(`${baseUrl}/dist/index.html`, { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait much longer for React to initialize and game to load
    console.log('Waiting 5 seconds for game initialization...');
    await page.waitForTimeout(5000);

    // Check for elements
    const hasTitle = await page.isVisible('.game-title').catch(() => false);
    const hasViewport = await page.isVisible('.game-viewport').catch(() => false);
    const hasError = await page.isVisible('.error-screen').catch(() => false);
    const hasLoading = await page.isVisible('.loading-screen').catch(() => false);

    console.log('Element visibility:');
    console.log('  - Title:', hasTitle);
    console.log('  - Viewport:', hasViewport);
    console.log('  - Error:', hasError);
    console.log('  - Loading:', hasLoading);

    if (hasError) {
      const errorText = await page.textContent('.error-screen').catch(() => 'Unknown');
      console.error('❌ Error state:', errorText);
    }

    // Capture initial state
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-react-app.png'),
      fullPage: false
    });
    console.log('✅ Saved: golden-sun-react-app.png');

    // Wait a bit more and capture again
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/golden-sun-after-load.png'),
      fullPage: false
    });
    console.log('✅ Saved: golden-sun-after-load.png');

    // Try movement if game loaded
    if (hasViewport && !hasError && !hasLoading) {
      console.log('Game appears loaded, trying movement...');
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(1500);
      await page.keyboard.up('ArrowRight');
      await page.waitForTimeout(500);

      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-with-movement.png'),
        fullPage: false
      });
      console.log('✅ Saved: golden-sun-with-movement.png');
    }

    // Also try the mockup for comparison
    console.log('\\nCapturing mockup for comparison...');
    await page.goto(`${baseUrl}/mockups/vale-village.html`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/vale-village-mockup.png'),
      fullPage: false
    });
    console.log('✅ Saved: vale-village-mockup.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    
    // Capture current state
    try {
      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/golden-sun-error-capture.png'),
        fullPage: true
      });
      console.log('📸 Saved error state screenshot');

      // Try to get page content
      const html = await page.content();
      const fs = require('fs');
      fs.writeFileSync(path.join(__dirname, 'screenshots/page-debug.html'), html);
      console.log('📄 Saved page HTML for debugging');
    } catch (e) {
      console.error('Could not save debug info');
    }
  } finally {
    await browser.close();
    console.log('\\n✅ Screenshot capture complete!');
  }
}

captureScreenshots().catch(console.error);
