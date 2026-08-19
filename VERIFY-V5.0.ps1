Write-Host "AETER/NOVA // V5.0 NIGHT CIRCUIT VERIFY" -ForegroundColor Cyan
Write-Host ""
if (!(Test-Path ".\BUILD-ID.txt")) { Write-Host "FAIL: BUILD-ID.txt missing" -ForegroundColor Red; exit 1 }
Get-Content ".\BUILD-ID.txt"
Write-Host ""
$required=@("index.html","css\app.css","js\app.js","js\engine.js","js\data.js","js\bootstrap.js","assets\audio\transmission-machine.ogg")
foreach($f in $required){ if(Test-Path $f){Write-Host "OK  $f" -ForegroundColor Green}else{Write-Host "MISSING  $f" -ForegroundColor Red} }
Write-Host ""
if(Test-Path ".git"){ git status --short } else { Write-Host "This folder is not a Git working tree yet." -ForegroundColor Yellow }
