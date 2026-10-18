const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = 'C:\\Program Files\\Softdeluxe\\Free Download Manager\\ffmpeg.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const AUDIO_PATH = path.resolve(__dirname, '..', 'ref_audio.m4a');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'remotale_saas_promo.mp4');

const TOTAL_FRAMES = 945; // 31.5 seconds at 30 fps
const FPS = 30;

async function renderVideo() {
  console.log('========================================================');
  console.log('🚀 REMOTALE SAAS VIDEO RENDERING ENGINE');
  console.log('========================================================');
  console.log(`Resolution: 1080 x 1920 (9:16 Vertical Shorts/Reels)`);
  console.log(`Total Frames: ${TOTAL_FRAMES} @ ${FPS} FPS (~31.5 seconds)`);
  console.log(`Audio: ${AUDIO_PATH}`);
  console.log(`Output: ${OUTPUT_PATH}`);

  // Delete previous output if exists
  if (fs.existsSync(OUTPUT_PATH)) {
    try { fs.unlinkSync(OUTPUT_PATH); } catch (e) {}
  }

  // Spawn FFmpeg process
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', '-',
    '-i', AUDIO_PATH,
    '-c:v', 'h264_mf',
    '-b:v', '8M',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    OUTPUT_PATH
  ];

  console.log('Starting FFmpeg encoder...');
  const ffmpeg = spawn(FFMPEG_PATH, ffmpegArgs, {
    stdio: ['pipe', 'inherit', 'inherit']
  });

  ffmpeg.on('error', (err) => {
    console.error('FFmpeg process error:', err);
  });

  // Launch Edge browser
  console.log('Launching headless Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--force-device-scale-factor=1'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const htmlUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log('Loading animation DOM:', htmlUrl);
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

  // Initial render at frame 0
  await page.evaluate(() => window.seekFrame(0, 945));
  await new Promise(r => setTimeout(r, 500));

  console.log('Starting frame-by-frame rendering into FFmpeg pipe...');
  const startTime = Date.now();

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    // Update animation state to exact frame
    await page.evaluate((f, total) => window.seekFrame(f, total), frame, TOTAL_FRAMES);

    // Capture screenshot buffer as high-quality JPEG
    const buffer = await page.screenshot({
      type: 'jpeg',
      quality: 92
    });

    // Write buffer to FFmpeg stdin
    const ok = ffmpeg.stdin.write(buffer);
    if (!ok) {
      await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }

    if (frame % 45 === 0 || frame === TOTAL_FRAMES - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = Math.round((frame / TOTAL_FRAMES) * 100);
      const fpsReal = (frame / ((Date.now() - startTime) / 1000)).toFixed(1);
      console.log(`[Frame ${String(frame).padStart(3, ' ')}/${TOTAL_FRAMES} | ${String(pct).padStart(2, ' ')}%] Elapsed: ${elapsed}s (${fpsReal} fps)`);
    }
  }

  console.log('All frames piped! Finalizing video encoding...');
  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });

  await browser.close();

  if (fs.existsSync(OUTPUT_PATH)) {
    const stats = fs.statSync(OUTPUT_PATH);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('========================================================');
    console.log('🎉 SUCCESS: remotale_saas_promo.mp4 GENERATED!');
    console.log(`📁 File: ${OUTPUT_PATH}`);
    console.log(`📦 Size: ${sizeMb} MB`);
    console.log(`⏱️ Total Render Time: ${totalTime}s`);
    console.log('========================================================');
  } else {
    console.error('ERROR: Video file was not created!');
    process.exit(1);
  }
}

renderVideo().catch(err => {
  console.error('Fatal error during video render:', err);
  process.exit(1);
});
