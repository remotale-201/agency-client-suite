const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const framesToTest = [
  { frame: 50, name: 'scene1_intro.jpg' },
  { frame: 140, name: 'scene2_prompt_typing.jpg' },
  { frame: 220, name: 'scene2_prompt_click.jpg' },
  { frame: 320, name: 'scene3_admin_dashboard.jpg' },
  { frame: 480, name: 'scene4_awais_portal.jpg' },
  { frame: 580, name: 'scene4_deliverable_approved.jpg' },
  { frame: 700, name: 'scene5_invoice_paid.jpg' },
  { frame: 820, name: 'scene6_3d_features.jpg' },
  { frame: 900, name: 'scene7_outro_cta.jpg' }
];

(async () => {
  console.log('Launching Edge headless...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('Navigating to:', htmlUrl);
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

  for (const item of framesToTest) {
    await page.evaluate((f) => window.seekFrame(f), item.frame);
    const outPath = path.resolve(__dirname, item.name);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    console.log(`Saved frame ${item.frame} -> ${item.name}`);
  }

  await browser.close();
  console.log('All preview frames generated successfully!');
})();
