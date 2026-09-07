# Auto-detect and fix Node.js & npx PATH in current PowerShell session
$pathsToAdd = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:APPDATA\npm",
    "$env:LOCALAPPDATA\Programs\node"
)

foreach ($p in $pathsToAdd) {
    if (Test-Path $p) {
        if ($env:Path -notlike "*$p*") {
            $env:Path = "$p;" + $env:Path
        }
    }
}

# Check if node and npx exist
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "[ERROR] Node.js is not found on this computer." -ForegroundColor Red
    Write-Host "Please install Node.js (LTS version) using one of the following:" -ForegroundColor Yellow
    Write-Host "1. Download and run installer: https://nodejs.org" -ForegroundColor Cyan
    Write-Host "2. Or run this command in terminal: winget install OpenJS.NodeJS.LTS" -ForegroundColor Cyan
    Write-Host ""
    Exit
}

Write-Host "[OK] Node.js Version: $(node -v)" -ForegroundColor Green
Write-Host "[OK] npx Version: $(npx -v)" -ForegroundColor Green

# Install node_modules if missing
if (!(Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "[INFO] node_modules not found. Running 'npm install' for first-time setup..." -ForegroundColor Cyan
    cmd /c npm install
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Starting Expo Dev Server (SDK 54 - Expo Go) " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
cmd /c npx expo start --go --lan
