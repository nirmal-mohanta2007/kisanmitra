const os = require('os');
const path = require('path');
const fs = require('fs');
const qrcodeCore = require('./qrcode-core');

function getLocalIPs() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const isIpv4 = net.family === 'IPv4' || net.family === 4;
      if (isIpv4 && !net.internal) {
        ips.push({ name, address: net.address });
      }
    }
  }
  return ips;
}

/**
 * Render high-contrast ANSI QR code for terminal
 * Uses ANSI 47 (white bg) and ANSI 30 (black fg) with half-block Unicode characters
 * This ensures pitch-black modules on pure white background on ANY terminal theme.
 */
function renderTerminalQR(url, margin = 2) {
  const qr = qrcodeCore(0, 'M');
  qr.addData(url);
  qr.make();

  const count = qr.getModuleCount();
  const total = count + margin * 2;
  const WHITE_BG_BLACK_FG = '\x1b[47;30m';
  const RESET = '\x1b[0m';
  const lines = [];

  for (let y = 0; y < total; y += 2) {
    let line = WHITE_BG_BLACK_FG;
    const r1 = y - margin;
    const r2 = y + 1 - margin;

    for (let x = 0; x < total; x++) {
      const c = x - margin;
      const topDark = (r1 >= 0 && r1 < count && c >= 0 && c < count) ? qr.isDark(r1, c) : false;
      const botDark = (r2 >= 0 && r2 < count && c >= 0 && c < count) ? qr.isDark(r2, c) : false;

      if (topDark && botDark) {
        line += '█';
      } else if (topDark && !botDark) {
        line += '▀';
      } else if (!topDark && botDark) {
        line += '▄';
      } else {
        line += ' ';
      }
    }
    line += RESET;
    lines.push(line);
  }
  return lines.join('\n');
}

function generateSvgQR(url, cellSize = 6, margin = 2) {
  const qr = qrcodeCore(0, 'M');
  qr.addData(url);
  qr.make();
  return qr.createSvg(cellSize, margin * cellSize);
}

async function main() {
  const ips = getLocalIPs();
  const wifi = ips.find(i => /wi-?fi/i.test(i.name)) || ips[0] || { name: 'Localhost', address: '127.0.0.1' };
  const hotspot = ips.find(i => /local area/i.test(i.name) || i.address.startsWith('192.168.137')) || null;

  const port = process.env.PORT || '8081';
  const wifiUrl = `exp://${wifi.address}:${port}`;
  const hotspotUrl = hotspot ? `exp://${hotspot.address}:${port}` : null;
  const clientApkUrl = 'https://www.apkmirror.com/apk/expo-project/expo-go/expo-go-54-0-8-release/';

  console.log('\n' + '='.repeat(66));
  console.log('       🌱 KISAN MITRA - EXPO GO SDK 54 (CLIENT v54.0.8)');
  console.log('='.repeat(66));

  console.log('\n' + '-'.repeat(66));
  console.log(` 📱 [1] EXPO GO APP DEV SERVER (SDK 54)`);
  console.log(` Network Interface : ${wifi.name} (${wifi.address})`);
  console.log(` Target Expo URL   : ${wifiUrl}`);
  console.log(` Action: Scan with Expo Go (v54.0.8) or Mobile Camera:`);
  console.log('-'.repeat(66) + '\n');
  console.log(renderTerminalQR(wifiUrl, 2));

  console.log('\n' + '-'.repeat(66));
  console.log(` 📦 [2] EXPO GO CLIENT v54.0.8 (APK DOWNLOAD LINK)`);
  console.log(` Direct APK URL    : ${clientApkUrl}`);
  console.log(` Action: Scan to download & install Expo Go v54.0.8 on Android:`);
  console.log('-'.repeat(66) + '\n');
  console.log(renderTerminalQR(clientApkUrl, 2));

  if (hotspotUrl) {
    console.log('\n' + '-'.repeat(66));
    console.log(` 📡 [3] MOBILE HOTSPOT SERVER`);
    console.log(` Network Interface : ${hotspot.name} (${hotspot.address})`);
    console.log(` Target Expo URL   : ${hotspotUrl}`);
    console.log('-'.repeat(66) + '\n');
    console.log(renderTerminalQR(hotspotUrl, 2));
  }

  // Generate SVGs for HTML viewer
  const wifiSvg = generateSvgQR(wifiUrl, 7, 2);
  const hotspotSvg = hotspotUrl ? generateSvgQR(hotspotUrl, 7, 2) : '';
  const apkSvg = generateSvgQR(clientApkUrl, 7, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kisan Mitra - Expo Go SDK 54 (v54.0.8) QR Codes</title>
  <style>
    :root {
      --primary: #2E7D32;
      --primary-dark: #1B5E20;
      --primary-light: #E8F5E9;
      --accent: #FF9800;
      --blue: #1976D2;
      --blue-light: #E3F2FD;
      --bg: #F4F7F5;
      --surface: #FFFFFF;
      --text: #1C2826;
      --text-muted: #556B60;
      --border: #DDE5E0;
      --radius: 16px;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
    }
    header {
      text-align: center;
      margin-bottom: 28px;
      max-width: 720px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary-light);
      color: var(--primary-dark);
      font-weight: 700;
      font-size: 0.82rem;
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 12px;
      border: 1px solid #C8E6C9;
    }
    h1 {
      font-size: 2.1rem;
      color: var(--primary-dark);
      margin-bottom: 8px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 900px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
    }
    .card.green::before {
      background: linear-gradient(90deg, #43A047, #2E7D32);
    }
    .card.blue::before {
      background: linear-gradient(90deg, #1E88E5, #0D47A1);
    }
    .card h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 6px;
      margin-bottom: 4px;
    }
    .card p.card-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .qr-frame {
      background: #ffffff;
      padding: 14px;
      border-radius: 12px;
      border: 2px dashed #C8E6C9;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card.blue .qr-frame {
      border-color: #BBDEFB;
    }
    .qr-frame svg {
      display: block;
      width: 240px;
      height: 240px;
      border-radius: 6px;
    }
    .url-chip {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-family: monospace;
      font-size: 0.92rem;
      color: var(--text);
      word-break: break-all;
      margin-bottom: 14px;
      width: 100%;
      user-select: all;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      width: 100%;
    }
    .btn-green {
      background: var(--primary);
      color: white;
    }
    .btn-green:hover {
      background: var(--primary-dark);
    }
    .btn-blue {
      background: var(--blue);
      color: white;
    }
    .btn-blue:hover {
      background: #0D47A1;
    }
    .guide-box {
      background: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      padding: 24px 28px;
      width: 100%;
      max-width: 900px;
    }
    .guide-box h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 14px;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .step {
      display: flex;
      gap: 12px;
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-light);
      color: var(--primary-dark);
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .step-content strong {
      display: block;
      font-size: 0.95rem;
      margin-bottom: 3px;
    }
    .step-content p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    footer {
      margin-top: 32px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">🌱 Kisan Mitra • Mobile Connect</div>
    <h1>Expo Go SDK 54 (v54.0.8)</h1>
    <p class="subtitle">Scan the QR code with your mobile device running <strong>Expo Go v54.0.8</strong> or your phone camera.</p>
  </header>

  <div class="cards-grid">
    <!-- Card 1: Dev Server QR -->
    <div class="card green">
      <h2>🚀 Open Kisan Mitra App</h2>
      <p class="card-desc">Scan inside Expo Go (v54.0.8) or with phone camera</p>

      <div class="qr-frame">
        ${wifiSvg}
      </div>

      <div class="url-chip">${wifiUrl}</div>
      <a href="${wifiUrl}" class="btn btn-green">Open in Expo Go</a>
    </div>

    <!-- Card 2: Expo Go Client v54.0.8 APK Download -->
    <div class="card blue">
      <h2>📦 Expo Go Client v54.0.8</h2>
      <p class="card-desc">Download & install the exact Expo Go 54.0.8 Android APK</p>

      <div class="qr-frame">
        ${apkSvg}
      </div>

      <div class="url-chip">Expo Go v54.0.8 Android APK</div>
      <a href="${clientApkUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-blue">Download Client APK</a>
    </div>
  </div>

  <div class="guide-box">
    <h3>📱 How to Connect Your Phone:</h3>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-content">
          <strong>Ensure Same Network</strong>
          <p>Make sure your PC and mobile device are connected to the same Wi-Fi network (${wifi.address}).</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <strong>Start Expo Dev Server</strong>
          <p>Run <code>npx expo start --go --lan</code> in your terminal if not already running.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <strong>Scan the QR Code</strong>
          <p>Open <strong>Expo Go v54.0.8</strong> on Android & tap "Scan QR Code", or open Camera on iOS.</p>
        </div>
      </div>
    </div>
  </div>

  <footer>
    <p>Kisan Mitra App • Expo SDK 54.0.8 • Client v54.0.8</p>
  </footer>
</body>
</html>`;

  const appDir = path.resolve(__dirname, '..');
  const rootDir = path.resolve(appDir, '..');

  const htmlPathApp = path.join(appDir, 'expo-qr-viewer.html');
  const htmlPathRoot = path.join(rootDir, 'expo-qr-viewer.html');
  fs.writeFileSync(htmlPathApp, htmlContent, 'utf-8');
  fs.writeFileSync(htmlPathRoot, htmlContent, 'utf-8');

  console.log('-'.repeat(66));
  console.log(` ✅ Standalone HTML QR Viewer updated at:`);
  console.log(`    ${htmlPathRoot}`);
  console.log('='.repeat(66) + '\n');
}

main().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});
