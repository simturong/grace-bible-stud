const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let errors = 0;
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[ERROR] ${msg.text()}`);
      errors++;
    } else {
      console.log(`[LOG] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.toString()}`);
    errors++;
  });

  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  
  try {
    const playBtn = await page.$('#btnPlayerPlayToggle');
    if (playBtn) {
      await playBtn.click();
      await page.waitForTimeout(500);
    }

    const firstVerse = await page.$('.verse-audio-btn');
    if (firstVerse) {
      await firstVerse.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log(`[TEST ERROR] ${e.message}`);
    errors++;
  }

  console.log(`Integration test finished with ${errors} errors.`);
  await browser.close();
})();
