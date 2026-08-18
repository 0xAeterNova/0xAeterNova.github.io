$ErrorActionPreference = "Stop"
Write-Host "" 
Write-Host "AETER/NOVA TRANSMISSION MACHINE - V4.4 VERIFY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor DarkGray

if (-not (Test-Path ".\BUILD-ID.txt")) {
  Write-Host "FAIL: BUILD-ID.txt is missing from this folder." -ForegroundColor Red
  Write-Host "You are not running this from the V4.4 repository root." -ForegroundColor Yellow
  exit 1
}

$build = Get-Content ".\BUILD-ID.txt" -Raw
Write-Host $build -ForegroundColor White

if ($build -notmatch "VERSION:\s*4\.4\.0") {
  Write-Host "FAIL: This is not the V4.4 build." -ForegroundColor Red
  exit 1
}

$required = @(
  ".\index.html",
  ".\css\app.css",
  ".\js\app.js",
  ".\js\engine.js",
  ".\js\data.js",
  ".\assets\audio\transmission-machine.ogg",
  ".\assets\audio\transmission-machine.mp3"
)

$missing = @()
foreach ($file in $required) {
  if (-not (Test-Path $file)) { $missing += $file }
}

if ($missing.Count -gt 0) {
  Write-Host "FAIL: Missing required files:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
  exit 1
}

Write-Host "Required V4.4 runtime files: OK" -ForegroundColor Green
Write-Host "" 

if (Get-Command git -ErrorAction SilentlyContinue) {
  $inside = git rev-parse --is-inside-work-tree 2>$null
  if ($inside -eq "true") {
    Write-Host "Git repository detected." -ForegroundColor Green
    Write-Host "Git status:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace(($status -join ""))) {
      Write-Host "WARNING: Git still reports a clean tree." -ForegroundColor Yellow
      Write-Host "If you expected an upgrade, these V4.4 files were probably already committed or copied into a different folder." -ForegroundColor Yellow
      Write-Host "Run: git log -1 --oneline" -ForegroundColor DarkGray
    } else {
      Write-Host "GOOD: Git sees file changes. You can now git add -A, commit, and push." -ForegroundColor Green
    }
  } else {
    Write-Host "This folder is not a Git working tree. Copy the CONTENTS of V4.4 into your 0xAeterNova.github.io repository root first." -ForegroundColor Yellow
  }
} else {
  Write-Host "Git is not available in this PowerShell session." -ForegroundColor Yellow
}
