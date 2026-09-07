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
<<<<<<< HEAD
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
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
  const liveWebUrl = 'https://nirmal-mohanta2007.github.io/kisanmitra/';
  const localWebUrl = `http://localhost:${port}`;
  const lanWebUrl = `http://${wifi.address}:${port}`;
  const wifiExpoUrl = `exp://${wifi.address}:${port}`;
  const hotspotExpoUrl = hotspot ? `exp://${hotspot.address}:${port}` : null;
  const clientApkUrl = 'https://www.apkmirror.com/apk/expo-project/expo-go/expo-go-54-0-8-release/';

<<<<<<< HEAD
  console.log('\n' + '='.repeat(68));
  console.log('       🌾 KISAN MITRA - BROWSER & EXPO LAUNCHER');
  console.log('='.repeat(68));

  console.log('\n' + '-'.repeat(68));
  console.log(` 🌐 [1] LIVE CLOUD WEB APP (Runs directly in Chrome / Safari / Edge)`);
  console.log(` Direct Browser Link: ${liveWebUrl}`);
  console.log(` Status: Deployed & Online (No Expo Go or setup needed)`);
  console.log(` Action: Click the link or scan with standard camera to open in browser:`);
  console.log('-'.repeat(68) + '\n');
  console.log(renderTerminalQR(liveWebUrl, 2));

  console.log('\n' + '-'.repeat(68));
  console.log(` 💻 [2] LOCAL DEVELOPMENT WEB SERVER (Metro Bundler)`);
  console.log(` Local PC Link   : ${localWebUrl}`);
  console.log(` Mobile LAN Link : ${lanWebUrl}`);
  console.log(` Action: Run 'run-web.bat' to start the local dev server`);
  console.log('-'.repeat(68));

  console.log('\n' + '-'.repeat(68));
  console.log(` 📱 [3] EXPO GO APP DEV SERVER (SDK 54)`);
  console.log(` Network Interface : ${wifi.name} (${wifi.address})`);
  console.log(` Target Expo URL   : ${wifiExpoUrl}`);
  console.log(` Action: Scan with Expo Go (v54.0.8) or Mobile Camera:`);
  console.log('-'.repeat(68) + '\n');
  console.log(renderTerminalQR(wifiExpoUrl, 2));

  if (hotspotExpoUrl) {
    console.log('\n' + '-'.repeat(68));
    console.log(` 📡 [4] MOBILE HOTSPOT SERVER`);
    console.log(` Network Interface : ${hotspot.name} (${hotspot.address})`);
    console.log(` Target Expo URL   : ${hotspotExpoUrl}`);
    console.log('-'.repeat(68) + '\n');
    console.log(renderTerminalQR(hotspotExpoUrl, 2));
  }

  // Generate SVGs for HTML viewer
  const liveWebSvg = generateSvgQR(liveWebUrl, 7, 2);
  const lanWebSvg = generateSvgQR(lanWebUrl, 7, 2);
  const wifiExpoSvg = generateSvgQR(wifiExpoUrl, 7, 2);
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
  const apkSvg = generateSvgQR(clientApkUrl, 7, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🌾 Kisan Mitra - Web Browser & App Hub</title>
  <style>
    :root {
      --primary: #1565C0;
      --primary-dark: #0D47A1;
      --primary-light: #E3F2FD;
      --green: #2E7D32;
      --green-dark: #1B5E20;
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
      margin-bottom: 24px;
      max-width: 800px;
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
      font-size: 2.3rem;
      color: #0D47A1;
      margin-bottom: 8px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.5;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 1100px;
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
    .card.highlight::before { background: linear-gradient(90deg, #00C853, #1565C0); }
    .card.blue::before { background: linear-gradient(90deg, #1E88E5, #0D47A1); }
    .card.green::before { background: linear-gradient(90deg, #43A047, #2E7D32); }
    .card.orange::before { background: linear-gradient(90deg, #FB8C00, #E65100); }

    .card .tag {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .card.highlight .tag { background: #E8F5E9; color: #1B5E20; }
    .card.blue .tag { background: #E3F2FD; color: #0D47A1; }
    .card.green .tag { background: #F1F8E9; color: #33691E; }
    .card.orange .tag { background: #FFF3E0; color: #E65100; }

    .card h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 6px;
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
<<<<<<< HEAD
    .card.highlight .qr-frame { border-color: #81C784; }
    .card.green .qr-frame { border-color: #C8E6C9; }
    .card.orange .qr-frame { border-color: #FFE0B2; }
=======
>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a

    .qr-frame svg {
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
      font-size: 0.86rem;
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
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      width: 100%;
      margin-bottom: 8px;
    }
<<<<<<< HEAD
    .btn-green { background: #2E7D32; color: white; }
    .btn-green:hover { background: #1B5E20; transform: translateY(-1px); }
    .btn-blue { background: #1565C0; color: white; }
    .btn-blue:hover { background: #0D47A1; transform: translateY(-1px); }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .btn-outline:hover { background: #ECEFF1; }
=======
>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a

    .guide-box {
      background: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      padding: 24px 28px;
      width: 100%;
      max-width: 1100px;
      margin-bottom: 24px;
    }
    .guide-box h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 14px;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
      <span>🌾 Kisan Mitra • Live Web & Mobile Portal</span>
    </div>
    <h1>Run Kisan Mitra Anywhere</h1>
    <p class="subtitle">Open the app directly in any web browser without downloading, or scan to run on mobile.</p>
  </header>

  <div class="cards-grid">
<<<<<<< HEAD
    <!-- Card 1: Cloud Web Version (Recommended) -->
    <div class="card highlight">
      <span class="tag">⚡ Instant Access • No Install</span>
      <h2>🌐 1. Live Web Browser App</h2>
      <p class="card-desc">Runs instantly in Chrome, Safari, Edge, or mobile browser without Expo Go.</p>

      <div class="qr-frame">
        ${liveWebSvg}
      </div>

      <div class="url-chip">${liveWebUrl}</div>
      <a href="${liveWebUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-green">🚀 Open in Browser Now</a>
    </div>

    <!-- Card 2: Local Web Dev Server -->
    <div class="card blue">
      <span class="tag">💻 Local Dev Server</span>
      <h2>💻 2. Local PC / LAN Browser</h2>
      <p class="card-desc">For local development. Run <code>run-web.bat</code> in the project folder to start.</p>

      <div class="qr-frame">
        ${lanWebSvg}
      </div>

      <div class="url-chip">${localWebUrl}</div>
      <a href="${localWebUrl}" target="_blank" class="btn btn-blue">💻 Open Localhost (Port ${port})</a>
      <a href="${lanWebUrl}" target="_blank" class="btn btn-outline">📱 Open Phone LAN (${wifi.address})</a>
    </div>

=======

    </div>

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
    <!-- Card 3: Native Expo Go App -->
    <div class="card green">
      <span class="tag">📱 Native App</span>
      <h2>📱 3. Expo Go (SDK 54)</h2>
      <p class="card-desc">Scan with Expo Go v54.0.8 or camera to test native Android / iOS features.</p>

      <div class="qr-frame">
        ${wifiExpoSvg}
      </div>

      <div class="url-chip">${wifiExpoUrl}</div>
      <a href="${wifiExpoUrl}" class="btn btn-green">Open in Expo Go</a>
    </div>

    <!-- Card 4: APK Download -->
    <div class="card orange">
      <span class="tag">📦 Android APK</span>
      <h2>📦 4. Download Expo Go v54.0.8</h2>
      <p class="card-desc">If Play Store version (SDK 57) is incompatible, install exact v54.0.8 APK.</p>

      <div class="qr-frame">
        ${apkSvg}
      </div>

<<<<<<< HEAD
      <div class="url-chip">Expo Go v54.0.8 APK</div>
      <a href="${clientApkUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="background: #E65100; color: white;">Download APK</a>
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
    </div>
  </div>

  <div class="guide-box">
    <h3>💡 Quick Guide:</h3>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-content">
<<<<<<< HEAD
          <strong>Browser Mode (Zero Setup)</strong>
          <p>Click <a href="${liveWebUrl}" target="_blank">Open in Browser</a> to immediately access the app in your browser on PC or smartphone.</p>
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-content">
<<<<<<< HEAD
          <strong>Local Development</strong>
          <p>Double-click <code>run-web.bat</code> or <code>open-in-browser.bat</code> to start the local Metro Web bundler on port 8081.</p>
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <strong>Mobile Testing</strong>
          <p>Connect your phone and PC to Wi-Fi (<code>${wifi.address}</code>) and scan the QR code using Expo Go v54.0.8.</p>
        </div>
      </div>
    </div>
  </div>

  <footer>
<<<<<<< HEAD
    <p>Kisan Mitra Platform • Talcher Mandi Command Console • SDK 54</p>
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
  </footer>
</body>
</html>`;

<<<<<<< HEAD
  // Safely determine output paths avoiding drive root
  const currentDir = path.resolve(__dirname, '..');
  const parentDir = path.resolve(currentDir, '..');

  const targets = new Set();
  if (fs.existsSync(path.join(currentDir, 'package.json'))) {
    targets.add(currentDir);
  }
  if (fs.existsSync(path.join(parentDir, 'package.json'))) {
    targets.add(parentDir);
  }
  const nested = path.join(currentDir, 'KISAN MITRA');
  if (fs.existsSync(path.join(nested, 'package.json'))) {
    targets.add(nested);
  }

  for (const t of targets) {
    const p = path.join(t, 'expo-qr-viewer.html');
    fs.writeFileSync(p, htmlContent, 'utf-8');
    console.log(` ✅ Updated viewer: ${p}`);
  }
  console.log('='.repeat(68) + '\n');
=======

>>>>>>> 98fc0b6206eb143c09b334390ac3fd09db5e7e5a
}

main().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});
