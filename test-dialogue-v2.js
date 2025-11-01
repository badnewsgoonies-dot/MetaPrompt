/**
 * Test dialogue with manual key holds
 */

const { chromium } = require('playwright');
const path = require('path');

async function testDialogue() {
  const browser = await chromium.launch({ headless: false }); // Visible browser
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  console.log('🧪 Testing Dialogue (visible browser, manual interaction)...\n');
  console.log('Instructions:');
  console.log('1. Use Arrow Keys or WASD to move toward an NPC');
  console.log('2. Look for the 💬 icon above NPCs when in range');
  console.log('3. Press Enter to talk');
  console.log('4. Press Enter again to advance dialogue');
  console.log('5. Close browser when done\n');

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.goto('http://localhost:8081', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/dialogue-manual-test.png')
    });
    console.log('✅ Initial screenshot saved');
    console.log('\\n🎮 Browser is now open for manual testing...');
    console.log('   Close the browser when done testing.\n');

    // Wait for user to close browser
    await page.waitForTimeout(120000); // 2 minutes max

  } catch (error) {
    if (!error.message.includes('Target closed') && !error.message.includes('Session closed')) {
      console.error('❌ Error:', error.message);
    }
  } finally {
    try {
      await browser.close();
    } catch (e) {
      // Browser already closed
    }
    console.log('✅ Test session ended');
  }
}

testDialogue().catch(console.error);
