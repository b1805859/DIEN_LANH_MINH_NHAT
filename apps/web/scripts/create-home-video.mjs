import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Rebuild the silent, illustrative homepage montage from the local image assets.
// Run: node apps/web/scripts/create-home-video.mjs
const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(webRoot, 'public/videos');
const durationSeconds = 14;
const imageNames = ['hero.webp', 'install.webp', 'clean.webp', 'about.webp'];
const scenes = [
  ['Tiếp nhận yêu cầu', 'Qua điện thoại, Zalo hoặc website'],
  ['Kiểm tra & tư vấn', 'Kỹ thuật viên khảo sát, báo tình trạng'],
  ['Thực hiện dịch vụ', 'Sửa chữa, lắp đặt, vệ sinh theo yêu cầu'],
  ['Nghiệm thu & bàn giao', 'Kiểm tra hoạt động, hướng dẫn sử dụng'],
];
const images = await Promise.all(imageNames.map(async (name) =>
  `data:image/webp;base64,${(await readFile(resolve(webRoot, 'public/images/home-reference', name))).toString('base64')}`,
));
const fontData = (await readFile(resolve(webRoot, 'public/fonts/QdVMSTAyLFyeg_IDWvOJmVES_HSMIF8y.ttf'))).toString('base64');

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});

try {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const result = await page.evaluate(async ({ images, scenes, fontData, durationSeconds }) => {
    const font = new FontFace('Montage', `url(data:font/ttf;base64,${fontData})`);
    document.fonts.add(await font.load());
    const loadedImages = await Promise.all(images.map((src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    })));
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 540;
    document.body.style.margin = '0';
    document.body.append(canvas);
    const ctx = canvas.getContext('2d');
    const preferredCodec = 'video/webm;codecs=vp9';
    const mimeType = MediaRecorder.isTypeSupported(preferredCodec) ? preferredCodec : 'video/webm;codecs=vp8';
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000 });
    const chunks = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    const stopped = new Promise((resolve) => { recorder.onstop = resolve; });
    const sceneDuration = durationSeconds / scenes.length;

    function paintScene(index, progress, opacity = 1) {
      const image = loadedImages[index];
      const zoom = 1.015 + progress * 0.045;
      const scale = Math.max(960 / image.width, 540 / image.height) * zoom;
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(image, (960 - width) / 2 - 8 * progress, (540 - height) / 2, width, height);
      ctx.restore();
    }

    function draw(time) {
      const sceneIndex = Math.min(scenes.length - 1, Math.floor(time / sceneDuration));
      const local = time - sceneIndex * sceneDuration;
      const progress = local / sceneDuration;
      paintScene(sceneIndex, progress);
      if (sceneIndex > 0 && local < 0.35) paintScene(sceneIndex - 1, 1, 1 - local / 0.35);
      const shade = ctx.createLinearGradient(0, 0, 0, 540);
      shade.addColorStop(0, 'rgba(0,21,41,0.68)');
      shade.addColorStop(0.36, 'rgba(0,21,41,0.03)');
      shade.addColorStop(0.62, 'rgba(0,21,41,0.46)');
      shade.addColorStop(1, 'rgba(0,21,41,0.98)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, 960, 540);
      ctx.fillStyle = '#70d8ff';
      ctx.font = '700 17px Montage';
      ctx.fillText('ĐIỆN LẠNH MINH NHẬT', 42, 47);
      ctx.fillStyle = '#e0eff9';
      ctx.font = '700 12px Montage';
      ctx.textAlign = 'right';
      ctx.fillText('Hình ảnh minh họa quy trình', 918, 45);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#00bdff';
      ctx.font = '700 18px Montage';
      ctx.fillText(`0${sceneIndex + 1}  /  QUY TRÌNH LÀM VIỆC`, 42, 368);
      ctx.fillStyle = '#fff';
      ctx.font = '700 35px Montage';
      ctx.fillText(scenes[sceneIndex][0], 42, 414);
      ctx.fillStyle = '#d8e8f4';
      ctx.font = '700 17px Montage';
      ctx.fillText(scenes[sceneIndex][1], 43, 450);
      for (let i = 0; i < 4; i += 1) {
        const x = 42 + i * 223;
        ctx.fillStyle = 'rgba(133,198,234,0.30)';
        ctx.fillRect(x, 492, 209, 3);
        if (i <= sceneIndex) {
          ctx.fillStyle = '#00c8ff';
          ctx.fillRect(x, 492, 209 * (i === sceneIndex ? progress : 1), 3);
        }
      }
    }

    draw(0);
    recorder.start();
    const start = performance.now();
    await new Promise((resolve) => {
      function frame(now) {
        const seconds = Math.min(durationSeconds - 0.001, (now - start) / 1000);
        draw(seconds);
        if (now - start >= durationSeconds * 1000) { resolve(); return; }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    recorder.stop();
    await stopped;
    stream.getTracks().forEach((track) => track.stop());
    const blob = new Blob(chunks, { type: mimeType });
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    return { mimeType, base64: dataUrl.split(',')[1] };
  }, { images, scenes, fontData, durationSeconds });

  // MediaRecorder omits WebM duration. Add the standard Matroska Info/Duration
  // field so native video controls expose a finite timeline immediately.
  function readVint(bytes, offset, keepMarker = false) {
    let length = 1;
    let marker = 0x80;
    while (!(bytes[offset] & marker)) { length += 1; marker >>= 1; }
    let value = keepMarker ? bytes[offset] : bytes[offset] & (marker - 1);
    for (let i = 1; i < length; i += 1) value = value * 256 + bytes[offset + i];
    return { length, value };
  }
  function encodeVint(value, length) {
    const bytes = Buffer.alloc(length);
    for (let i = length - 1; i >= 0; i -= 1) { bytes[i] = value % 256; value = Math.floor(value / 256); }
    bytes[0] |= 1 << (8 - length);
    return bytes;
  }
  function addDuration(bytes) {
    let offset = 0;
    while (offset < bytes.length) {
      const id = readVint(bytes, offset, true);
      const size = readVint(bytes, offset + id.length);
      const start = offset + id.length + size.length;
      if (id.value === 0x18538067) { offset = start; continue; }
      if (id.value === 0x1549a966) {
        const duration = Buffer.alloc(11);
        duration.set([0x44, 0x89, 0x88]);
        duration.writeDoubleBE(durationSeconds * 1000, 3);
        return Buffer.concat([
          bytes.subarray(0, offset + id.length),
          encodeVint(size.value + duration.length, size.length),
          bytes.subarray(start, start + size.value), duration,
          bytes.subarray(start + size.value),
        ]);
      }
      offset = start + size.value;
    }
    throw new Error('Unable to find WebM Info for duration metadata');
  }
  const video = addDuration(Buffer.from(result.base64, 'base64'));
  await mkdir(outputRoot, { recursive: true });
  const output = resolve(outputRoot, 'minh-nhat-process.webm');
  await writeFile(output, video);
  await writeFile(resolve(outputRoot, 'minh-nhat-process.vi.vtt'), `WEBVTT\n\nNOTE\nVideo minh họa quy trình bằng hình ảnh, không có lời thoại.\n\n00:00.000 --> 00:03.500\n01. Tiếp nhận yêu cầu\nQua điện thoại, Zalo hoặc website\n\n00:03.500 --> 00:07.000\n02. Kiểm tra & tư vấn\nKỹ thuật viên khảo sát, báo tình trạng\n\n00:07.000 --> 00:10.500\n03. Thực hiện dịch vụ\nSửa chữa, lắp đặt, vệ sinh theo yêu cầu\n\n00:10.500 --> 00:14.000\n04. Nghiệm thu & bàn giao\nKiểm tra hoạt động, hướng dẫn sử dụng\n`);
  const verification = await page.evaluate(async (base64) => {
    const element = document.createElement('video');
    element.muted = true;
    element.src = `data:video/webm;base64,${base64}`;
    await new Promise((resolve, reject) => { element.onloadedmetadata = resolve; element.onerror = reject; });
    const metadata = { duration: element.duration, width: element.videoWidth, height: element.videoHeight };
    element.currentTime = 11.2;
    await new Promise((resolve, reject) => { element.onseeked = resolve; element.onerror = reject; });
    return { ...metadata, seekVerified: element.currentTime === 11.2 };
  }, video.toString('base64'));
  console.log(JSON.stringify({ output, codec: result.mimeType, bytes: video.length, ...verification }, null, 2));
} finally {
  await browser.close();
}
