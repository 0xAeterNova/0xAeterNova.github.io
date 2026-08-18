param(
  [string]$Destination = "C:\Users\Xpl0iS4n\Desktop\0xAeterNova.github.io"
)

$ErrorActionPreference = "Stop"
$Source = $PSScriptRoot

Write-Host "" 
Write-Host "AETER/NOVA V4.4 // DEEP SIGNAL INSTALLER" -ForegroundColor Cyan
Write-Host "Source:      $Source" -ForegroundColor DarkGray
Write-Host "Destination: $Destination" -ForegroundColor DarkGray

if (-not (Test-Path (Join-Path $Source "BUILD-ID.txt"))) {
  throw "BUILD-ID.txt is missing from the V4.4 source folder."
}
if (-not (Test-Path $Destination)) {
  throw "Destination repository does not exist: $Destination"
}
if (-not (Test-Path (Join-Path $Destination ".git"))) {
  throw "Destination is not the expected Git working tree (.git not found)."
}

$rootFiles = @(
  ".nojekyll","404.html","about.html","contact.html","cyber.html","projects.html",
  "index.html","DIAGNOSTICS.html","START-PORTFOLIO.bat","start-local.bat","start-local.sh",
  "BUILD-ID.txt","README.md","START-HERE.md","PUBLISHING.md","ADDING-PROJECTS.md",
  "CHANGELOG-V4.4.md","VERIFY-V4.4.ps1"
)

foreach ($file in $rootFiles) {
  $src = Join-Path $Source $file
  if (Test-Path $src) { Copy-Item $src (Join-Path $Destination $file) -Force }
}

foreach ($dir in @("css","js","assets")) {
  $src = Join-Path $Source $dir
  $dst = Join-Path $Destination $dir
  if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst | Out-Null }
  Copy-Item (Join-Path $src "*") $dst -Recurse -Force
}

# V4.4 intentionally removes the old About activity heatmap.
$oldHeatmap = Join-Path $Destination "assets\heatmap"
if (Test-Path $oldHeatmap) { Remove-Item $oldHeatmap -Recurse -Force }

Write-Host "" 
Write-Host "Installed build:" -ForegroundColor Cyan
Get-Content (Join-Path $Destination "BUILD-ID.txt")

Push-Location $Destination
try {
  Write-Host "" 
  Write-Host "Git must show changes below before you commit:" -ForegroundColor Cyan
  git status --short
  $status = git status --porcelain
  if ([string]::IsNullOrWhiteSpace(($status -join ""))) {
    Write-Host "" 
    Write-Host "Git still reports CLEAN." -ForegroundColor Yellow
    Write-Host "That means this exact V4.4 build is already present/committed, or this is not the repository you expected." -ForegroundColor Yellow
  } else {
    Write-Host "" 
    Write-Host "SUCCESS: Git sees the V4.4 runtime changes." -ForegroundColor Green
    Write-Host "Next: git add -A; git commit -m 'Transmission Machine v4.4 Deep Signal'; git push origin main" -ForegroundColor White
  }
} finally {
  Pop-Location
}
