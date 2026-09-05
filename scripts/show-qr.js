const os = require('os');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

function getLocalIPs() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({ name, address: net.address });
      }
    }
  }
  return ips;
}

async function main() {
  const ips = getLocalIPs();
  const wifi = ips.find(i => i.name.toLowerCase().includes('wi-fi') || i.name.toLowerCase().includes('wifi')) || ips[0] || { address: '127.0.0.1' };
  const hotspot = ips.find(i => i.name.toLowerCase().includes('local area') || i.address.startsWith('192.168.137')) || null;

  const port = process.env.PORT || '8081';
  const wifiUrl = `exp://${wifi.address}:${port}`;
  const hotspotUrl = hotspot ? `exp://${hotspot.address}:${port}` : null;
  const clientApkUrl = 'https://www.apkmirror.com/apk/expo-project/expo-go/expo-go-54-0-8-release/';

  console.log('\n' + '='.repeat(60));
  console.log('       KISAN MITRA - EXPO GO SDK 54 (v54.0.8) QR CODE');
  console.log('='.repeat(60));

  console.log(`\n============================================================`);
  console.log(` [1] EXPO GO APP DEV SERVER (SDK 54) - Wi-Fi: ${wifi.address}`);
  console.log(` 📱 Scan inside Expo Go App or Camera to open Kisan Mitra:`);
  console.log(` URL: ${wifiUrl}`);
  console.log(`============================================================\n`);
  const wifiTerminalQr = await QRCode.toString(wifiUrl, { type: 'terminal', small: true });
  console.log(wifiTerminalQr);

  console.log(`\n============================================================`);
  console.log(` [2] EXPO GO CLIENT v54.0.8 (APK DOWNLOAD QR)`);
  console.log(` 📦 Scan with Phone Camera / Browser to download Expo Go 54.0.8:`);
  console.log(` URL: ${clientApkUrl}`);
  console.log(`============================================================\n`);
  const apkTerminalQr = await QRCode.toString(clientApkUrl, { type: 'terminal', small: true });
  console.log(apkTerminalQr);

  if (hotspotUrl) {
    console.log(`\n============================================================`);
    console.log(` [3] HOTSPOT NETWORK DEV SERVER (${hotspot.address})`);
    console.log(` URL: ${hotspotUrl}`);
    console.log(`============================================================\n`);
    const hotspotTerminalQr = await QRCode.toString(hotspotUrl, { type: 'terminal', small: true });
    console.log(hotspotTerminalQr);
  }

  // Generate PNGs
  const appDir = path.resolve(__dirname, '..');
  const rootDir = path.resolve(appDir, '..');

  const wifiPng = path.join(appDir, 'expo-dev-wifi-qr.png');
  await QRCode.toFile(wifiPng, wifiUrl, {
    width: 450,
    margin: 2,
    color: { dark: '#1B5E20', light: '#FFFFFF' },
  });

  if (hotspotUrl) {
    const hotspotPng = path.join(appDir, 'expo-dev-hotspot-qr.png');
    await QRCode.toFile(hotspotPng, hotspotUrl, {
      width: 450,
      margin: 2,
      color: { dark: '#1B5E20', light: '#FFFFFF' },
    });
  }

  const apkPng = path.join(appDir, 'expo-go-client-54-0-8-qr.png');
  await QRCode.toFile(apkPng, clientApkUrl, {
    width: 450,
    margin: 2,
    color: { dark: '#0D47A1', light: '#FFFFFF' },
  });

  // Generate Data URLs for standalone HTML viewer
  const wifiDataUrl = await QRCode.toDataURL(wifiUrl, { width: 360, margin: 2, color: { dark: '#1B5E20', light: '#FFFFFF' } });
  const hotspotDataUrl = hotspotUrl ? await QRCode.toDataURL(hotspotUrl, { width: 360, margin: 2, color: { dark: '#1B5E20', light: '#FFFFFF' } }) : wifiDataUrl;
  const apkDataUrl = await QRCode.toDataURL(clientApkUrl, { width: 360, margin: 2, color: { dark: '#0D47A1', light: '#FFFFFF' } });

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
    .qr-frame img {
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
    .toggle-group {
      display: inline-flex;
      background: var(--bg);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid var(--border);
      margin-bottom: 16px;
    }
    .toggle-btn {
      padding: 6px 14px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      color: var(--text-muted);
    }
    .toggle-btn.active {
      background: white;
      color: var(--primary-dark);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
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
      <p class="card-desc">Scan inside the Expo Go app or your camera</p>

      ${hotspot ? `
      <div class="toggle-group">
        <button class="toggle-btn active" id="btn-wifi" onclick="switchNetwork('wifi')">Wi-Fi (${wifi.address})</button>
        <button class="toggle-btn" id="btn-hotspot" onclick="switchNetwork('hotspot')">Hotspot (${hotspot.address})</button>
      </div>
      ` : ''}

      <div class="qr-frame">
        <img id="dev-qr-img" src="${wifiDataUrl}" alt="Kisan Mitra Expo Dev Server QR Code" />
      </div>

      <div class="url-chip" id="dev-url-text">${wifiUrl}</div>
      <a href="${wifiUrl}" class="btn btn-green">Open in Browser / Metro</a>
    </div>

    <!-- Card 2: Expo Go Client v54.0.8 APK Download -->
    <div class="card blue">
      <h2>📦 Expo Go Client v54.0.8</h2>
      <p class="card-desc">Download & install the exact Expo Go 54.0.8 Android APK</p>

      <div class="qr-frame">
        <img src="${apkDataUrl}" alt="Expo Go v54.0.8 Client APK Download QR" />
      </div>

      <div class="url-chip">Expo Go v54.0.8 Android Release</div>
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
          <p>Make sure your PC and mobile device are connected to the same Wi-Fi network (or PC Mobile Hotspot).</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <strong>Start Expo Dev Server</strong>
          <p>Double-click <code>run-expo.bat</code> or run <code>npm start</code> in your terminal if not already running.</p>
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
    <p>Kisan Mitra App • Expo SDK 54.0.0 • Client v54.0.8</p>
  </footer>

  <script>
    const wifiData = "${wifiDataUrl}";
    const wifiUrl = "${wifiUrl}";
    const hotspotData = "${hotspotDataUrl}";
    const hotspotUrl = "${hotspotUrl || ''}";

    function switchNetwork(type) {
      const img = document.getElementById('dev-qr-img');
      const text = document.getElementById('dev-url-text');
      const btnWifi = document.getElementById('btn-wifi');
      const btnHotspot = document.getElementById('btn-hotspot');

      if (type === 'hotspot' && hotspotUrl) {
        img.src = hotspotData;
        text.innerText = hotspotUrl;
        if (btnHotspot) btnHotspot.classList.add('active');
        if (btnWifi) btnWifi.classList.remove('active');
      } else {
        img.src = wifiData;
        text.innerText = wifiUrl;
        if (btnWifi) btnWifi.classList.add('active');
        if (btnHotspot) btnHotspot.classList.remove('active');
      }
    }
  </script>
</body>
</html>`;

  const htmlPathApp = path.join(appDir, 'expo-qr-viewer.html');
  const htmlPathRoot = path.join(rootDir, 'expo-qr-viewer.html');
  fs.writeFileSync(htmlPathApp, htmlContent, 'utf-8');
  fs.writeFileSync(htmlPathRoot, htmlContent, 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log(`[SAVED] QR code files generated:`);
  console.log(`- HTML Viewer : ${htmlPathRoot}`);
  console.log(`- Wi-Fi PNG   : ${wifiPng}`);
  if (hotspotUrl) {
    console.log(`- Hotspot PNG : ${path.join(appDir, 'expo-dev-hotspot-qr.png')}`);
  }
  console.log(`- Client APK  : ${apkPng}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});
