# Push Kisan Mitra to GitHub
Set-Location -Path $PSScriptRoot

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Pushing Kisan Mitra to GitHub..." -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

# Add Git to session Path if missing
$gitPaths = @("C:\Program Files\Git\cmd", "C:\Program Files\Git\bin", "$env:LOCALAPPDATA\Programs\Git\cmd")
foreach ($p in $gitPaths) {
    if ((Test-Path $p) -and ($env:Path -notlike "*$p*")) {
        $env:Path += ";$p"
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git was not found on your system." -ForegroundColor Red
    Write-Host "Please download Git from https://git-scm.com/ or run: winget install Git.Git" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Git version: $(git --version)" -ForegroundColor Green
Write-Host "Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: live procurement dashboard and mandi officer 9348856994 configuration"

Write-Host "Pushing to GitHub origin..." -ForegroundColor Yellow
git push origin HEAD

if ($LASTEXITCODE -ne 0) {
    Write-Host "Pushing with explicit branch name (Sibani)..." -ForegroundColor Yellow
    git push -u origin Sibani
}

Write-Host "`nAll done! Changes are pushed to GitHub." -ForegroundColor Green
