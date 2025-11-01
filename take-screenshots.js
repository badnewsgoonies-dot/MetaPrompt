const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 960, height: 720 }
  });

  // Load the Vale Village mockup
  const mockupPath = path.join(__dirname, 'golden-sun', 'mockups', 'vale-village.html');
  await page.goto(`file://${mockupPath}`);

  // Wait for content to load
  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: 'golden-sun/screenshots/vale-village-full.png',
    fullPage: false
  });

  console.log('Screenshot saved: golden-sun/screenshots/vale-village-full.png');

  // Zoom in on a specific area (where NPCs are)
  await page.setViewportSize({ width: 480, height: 320 });
  await page.screenshot({
    path: 'golden-sun/screenshots/vale-village-closeup.png'
  });

  console.log('Screenshot saved: golden-sun/screenshots/vale-village-closeup.png');

  await browser.close();
})();
