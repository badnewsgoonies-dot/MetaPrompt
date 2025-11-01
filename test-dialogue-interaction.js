/**
 * Test dialogue interaction with improved detection
 */

const { chromium } = require('playwright');
const path = require('path');

async function testDialogue() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.text().includes('Dialogue') || msg.text().includes('NPC') || msg.text().includes('interact')) {
      console.log('BROWSER:', msg.text());
    }
  });

  console.log('🧪 Testing Dialogue Interaction...\n');

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Loading game...');
    await page.goto('http://localhost:8081', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForTimeout(4000);

    // Capture initial state
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/dialogue-test-1-initial.png')
    });
    console.log('✅ Screenshot 1: Initial state\n');

    // Move left toward Garet (he's at 340, 220 - west of spawn 480, 320)
    console.log('Moving toward Garet...');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(500);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/dialogue-test-2-near-npc.png')
    });
    console.log('✅ Screenshot 2: Near NPC\n');

    // Check if interaction indicator appeared
    const hasIndicator = await page.evaluate(() => {
      const indicator = document.querySelector('.npc-indicator.interact');
      return indicator !== null;
    });
    console.log(`Interaction indicator visible: ${hasIndicator ? '✅ YES' : '❌ NO'}\n`);

    // Try to interact
    console.log('Pressing Enter to interact...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Check if dialogue appeared
    const hasDialogue = await page.isVisible('.dialogue-box').catch(() => false);
    console.log(`Dialogue box appeared: ${hasDialogue ? '✅ YES' : '❌ NO'}\n`);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/dialogue-test-3-after-interact.png')
    });
    console.log('✅ Screenshot 3: After interaction attempt\n');

    if (hasDialogue) {
      // Get dialogue text
      const dialogueText = await page.textContent('.dialogue-text').catch(() => '');
      const speakerName = await page.textContent('.dialogue-speaker').catch(() => '');
      console.log(`📜 Dialogue from ${speakerName}:`);
      console.log(`   "${dialogueText}"\n`);

      // Advance dialogue
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      await page.screenshot({ 
        path: path.join(__dirname, 'screenshots/dialogue-test-4-advanced.png')
      });
      console.log('✅ Screenshot 4: Dialogue advanced\n');

      // Check if text changed
      const newText = await page.textContent('.dialogue-text').catch(() => '');
      console.log(`   New text: "${newText}"\n`);
    } else {
      console.log('❌ Dialogue did not trigger. Debugging...\n');
      
      // Get player and NPC positions
      const debugInfo = await page.evaluate(() => {
        const sceneInfo = document.querySelector('.scene-coords');
        return {
          playerPos: sceneInfo ? sceneInfo.textContent : 'unknown',
          npcCount: document.querySelectorAll('.entity.npc').length,
          interactableCount: document.querySelectorAll('.entity.npc.interactable').length
        };
      });
      
      console.log('Debug Info:');
      console.log(`  Player position: ${debugInfo.playerPos}`);
      console.log(`  Total NPCs: ${debugInfo.npcCount}`);
      console.log(`  Interactable NPCs: ${debugInfo.interactableCount}\n`);
    }

    // Try moving to Dora (at 280, 260)
    console.log('\\nTrying another NPC (Dora)...');
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(500);

    const hasIndicator2 = await page.evaluate(() => {
      return document.querySelector('.npc-indicator.interact') !== null;
    });
    console.log(`Interaction indicator: ${hasIndicator2 ? '✅ YES' : '❌ NO'}`);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const hasDialogue2 = await page.isVisible('.dialogue-box').catch(() => false);
    console.log(`Dialogue appeared: ${hasDialogue2 ? '✅ YES' : '❌ NO'}\n`);

    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots/dialogue-test-5-second-npc.png')
    });
    console.log('✅ Screenshot 5: Second NPC attempt\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Test complete!');
  }
}

testDialogue().catch(console.error);
