param([string]$Destination = "C:\Users\Xpl0iS4n\Desktop\0xAeterNova.github.io")
$ErrorActionPreference = "Stop"
$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "AETER/NOVA V5.0 // NIGHT CIRCUIT INSTALL" -ForegroundColor Cyan
Write-Host "Source:      $Source"
Write-Host "Destination: $Destination"
if (!(Test-Path $Destination)) { throw "Destination repository does not exist: $Destination" }
$items = @(
  "index.html","404.html","projects.html","cyber.html","lab.html","arsenal.html","missions.html","timeline.html","about.html","contact.html",
  "css","js","assets",".nojekyll","BUILD-ID.txt","README.md","START-HERE.md","PUBLISHING.md","ADDING-PROJECTS.md","CHANGELOG-V5.0.md","DIAGNOSTICS.html","START-PORTFOLIO.bat","start-local.bat","start-local.sh","VERIFY-V5.0.ps1"
)
foreach($item in $items){
  $src = Join-Path $Source $item
  if(Test-Path $src){
    $dst = Join-Path $Destination $item
    if(Test-Path $dst){ Remove-Item $dst -Recurse -Force }
    Copy-Item $src $dst -Recurse -Force
  }
}
Write-Host ""; Write-Host "Installed V5.0 runtime. Git should now see changes:" -ForegroundColor Green
Push-Location $Destination
Get-Content .\BUILD-ID.txt
if(Test-Path .git){ git status --short }
Pop-Location
