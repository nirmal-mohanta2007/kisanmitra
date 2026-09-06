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
  const webUrl = `http://${wifi.address}:${port}`;
  const localWebUrl = `http://localhost:${port}`;
  const expoUrl = `exp://${wifi.address}:${port}`;
  const officialApkUrl = 'https://expo.dev/go?sdkVersion=54&platform=android&device=true';

  console.log('\n' + '='.repeat(64));
  console.log('       🌾 KISAN MITRA - AUTO-REFRESHING LIVE PORTAL 🌾');
  console.log('='.repeat(64));

  console.log(`\n================================================================`);
  console.log(` [1] DIRECT PHONE / PC WEB BROWSER (NO EXPO GO NEEDED)`);
  console.log(` 🌐 Phone Browser URL : ${webUrl}`);
  console.log(` 💻 Local PC URL      : ${localWebUrl}`);
  console.log(`================================================================\n`);
  const webTerminalQr = await QRCode.toString(webUrl, { type: 'terminal', small: true });
  console.log(webTerminalQr);

  console.log(`\n================================================================`);
  console.log(` [2] EXPO GO APP (NATIVE APP - SDK 54)`);
  console.log(` 📱 Scan inside Expo Go App:`);
  console.log(` URL: ${expoUrl}`);
  console.log(`================================================================\n`);
  const expoTerminalQr = await QRCode.toString(expoUrl, { type: 'terminal', small: true });
  console.log(expoTerminalQr);

  // Generate PNG files
  const appDir = path.resolve(__dirname, '..');
  const rootDir = path.resolve(appDir, '..');

  const webPng = path.join(appDir, 'kisan-operator-web-qr.png');
  await QRCode.toFile(webPng, webUrl, {
    width: 450,
    margin: 2,
    color: { dark: '#0D47A1', light: '#FFFFFF' },
  });

  const expoPng = path.join(appDir, 'kisan-expo-go-qr.png');
  await QRCode.toFile(expoPng, expoUrl, {
    width: 450,
    margin: 2,
    color: { dark: '#1B5E20', light: '#FFFFFF' },
  });

  const apkPng = path.join(appDir, 'expo-go-sdk54-download-qr.png');
  await QRCode.toFile(apkPng, officialApkUrl, {
    width: 450,
    margin: 2,
    color: { dark: '#E65100', light: '#FFFFFF' },
  });

  // Data URLs for standalone HTML viewer
  const webDataUrl = await QRCode.toDataURL(webUrl, { width: 360, margin: 2, color: { dark: '#0D47A1', light: '#FFFFFF' } });
  const expoDataUrl = await QRCode.toDataURL(expoUrl, { width: 360, margin: 2, color: { dark: '#1B5E20', light: '#FFFFFF' } });
  const apkDataUrl = await QRCode.toDataURL(officialApkUrl, { width: 360, margin: 2, color: { dark: '#E65100', light: '#FFFFFF' } });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🌾 Kisan Mitra - Auto-Refreshing Live Portal</title>
  <style>
    :root {
      --primary: #1565C0;
      --primary-dark: #0D47A1;
      --primary-light: #E3F2FD;
      --green: #2E7D32;
      --green-light: #E8F5E9;
      --orange: #E65100;
      --orange-light: #FFF3E0;
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
    }
    header {
      text-align: center;
      margin-bottom: 24px;
      max-width: 780px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green-light);
      color: var(--green);
      font-weight: 700;
      font-size: 0.88rem;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 12px;
      border: 1px solid #C8E6C9;
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00E676;
      box-shadow: 0 0 10px #00E676;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }
    h1 {
      font-size: 2.2rem;
      color: #1A237E;
      margin-bottom: 6px;
      font-weight: 800;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.4;
    }
    .status-bar {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 1100px;
      margin-bottom: 28px;
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
    .card.blue::before { background: linear-gradient(90deg, #1E88E5, #0D47A1); }
    .card.green::before { background: linear-gradient(90deg, #43A047, #2E7D32); }
    .card.orange::before { background: linear-gradient(90deg, #FB8C00, #E65100); }

    .card h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 6px;
      margin-bottom: 4px;
    }
    .card p.card-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      min-height: 38px;
    }
    .qr-frame {
      background: #ffffff;
      padding: 12px;
      border-radius: 12px;
      border: 2px dashed #BBDEFB;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card.green .qr-frame { border-color: #C8E6C9; }
    .card.orange .qr-frame { border-color: #FFE0B2; }

    .qr-frame img {
      display: block;
      width: 220px;
      height: 220px;
      border-radius: 6px;
    }
    .url-chip {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-family: monospace;
      font-size: 0.88rem;
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
      padding: 11px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      width: 100%;
      margin-bottom: 8px;
    }
    .btn-blue { background: var(--primary); color: white; }
    .btn-blue:hover { background: var(--primary-dark); }
    .btn-green { background: var(--green); color: white; }
    .btn-green:hover { background: #1B5E20; }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .btn-outline:hover {
      background: #ECEFF1;
    }
    .notice-box {
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 12px;
      padding: 16px 20px;
      max-width: 1100px;
      width: 100%;
      font-size: 0.92rem;
      color: #1B5E20;
      line-height: 1.5;
    }
    footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">
      <div class="pulse-dot"></div>
      <span>🌾 किसान मित्र • Live Refresh Portal</span>
    </div>
    <h1>Operator Dashboard Portal</h1>
    <p class="subtitle">यह पेज सर्वर के साथ ऑटो-रिफ्रेश होता है। आपको बार-बार नया लिंक मांगने की आवश्यकता नहीं है।</p>
  </header>

  <div class="status-bar" id="liveStatus">
    <div class="pulse-dot"></div>
    <span id="statusText">Checking Metro Server on Port 8081...</span>
  </div>

  <div class="cards-grid">
    <!-- Card 1: Direct Phone / PC Web -->
    <div class="card blue">
      <h2>🌐 1. Phone / PC Browser (Web)</h2>
      <p class="card-desc">फोन के सामान्य कैमरा से स्कैन करें या नीचे दिए बटन पर क्लिक करें। (Zero SDK Mismatch)</p>

      <div class="qr-frame">
        <img src="${webDataUrl}" alt="Web QR Code" />
      </div>

      <div class="url-chip">${webUrl}</div>
      <a href="${localWebUrl}" target="_blank" class="btn btn-blue">💻 Open on this PC (${localWebUrl})</a>
      <a href="${webUrl}" target="_blank" class="btn btn-outline">📱 Open Phone LAN (${webUrl})</a>
    </div>

    <!-- Card 2: Native Expo Go SDK 54 -->
    <div class="card green">
      <h2>📱 2. Expo Go App (SDK 54)</h2>
      <p class="card-desc">यदि आपके फोन में Expo Go v54 installed है तो सीधे Expo Go ऐप से स्कैन करें।</p>

      <div class="qr-frame">
        <img src="${expoDataUrl}" alt="Expo Go Dev Server QR Code" />
      </div>

      <div class="url-chip">${expoUrl}</div>
      <a href="${expoUrl}" class="btn btn-green">Open in Expo Go</a>
    </div>

    <!-- Card 3: Download Expo Go SDK 54 -->
    <div class="card orange">
      <h2>📦 3. Download Expo Go SDK 54</h2>
      <p class="card-desc">यदि Play Store वाला Expo Go (SDK 57) एरर दे रहा हो तो यहाँ से आधिकारिक SDK 54 APK लें।</p>

      <div class="qr-frame">
        <img src="${apkDataUrl}" alt="Expo Go APK QR" />
      </div>

      <div class="url-chip">Official Expo Go SDK 54 APK</div>
      <a href="${officialApkUrl}" target="_blank" class="btn btn-outline" style="background: #E65100; color: white;">Download SDK 54 APK</a>
    </div>
  </div>

  <div class="notice-box">
    <strong>💡 टोकन बचाने के लिए स्थायी उपाय (Permanent Solution):</strong>
    <p style="margin-top: 4px;">इस पेज को अपने ब्राउज़र में बुकमार्क कर लें। जब भी आप <code>run-web.bat</code> या <code>npm start</code> चलाएंगे, यह पोर्टल स्वतः लाइव हो जाएगा। आपको चैट में बार-बार QR कोड मांगने की आवश्यकता नहीं पड़ेगी!</p>
  </div>

  <footer>
    <p>Kisan Mitra Platform • Talcher Mandi Command Console • Port ${port}</p>
  </footer>

  <script>
    // Live Heartbeat Auto-detection
    const testUrl = 'http://localhost:${port}/';
    async function checkServer() {
      const statusEl = document.getElementById('statusText');
      try {
        const res = await fetch(testUrl, { mode: 'no-cors' });
        statusEl.innerText = '🟢 Server Online & Ready on Port ${port} (Auto-refresh active)';
        statusEl.style.color = '#2E7D32';
      } catch(e) {
        statusEl.innerText = '🟡 Server starting or offline... Run "run-web.bat" in your folder';
        statusEl.style.color = '#E65100';
      }
    }
    checkServer();
    setInterval(checkServer, 4000);
  </script>
</body>
</html>`;

  const htmlPathApp = path.join(appDir, 'expo-qr-viewer.html');
  const htmlPathRoot = path.join(rootDir, 'expo-qr-viewer.html');
  fs.writeFileSync(htmlPathApp, htmlContent, 'utf-8');
  fs.writeFileSync(htmlPathRoot, htmlContent, 'utf-8');

  console.log('\n' + '='.repeat(64));
  console.log(`[LIVE] QR Portal & PNGs Updated:`);
  console.log(`- Auto-Refreshing Portal : ${htmlPathRoot}`);
  console.log(`- Web Access QR PNG      : ${webPng}`);
  console.log(`- Expo Go QR PNG         : ${expoPng}`);
  console.log('='.repeat(64) + '\n');
}

main().catch(err => {
  console.error('Error in show-qr.js:', err);
  process.exit(1);
});
