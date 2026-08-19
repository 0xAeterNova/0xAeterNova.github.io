$root = Get-Location
Write-Host "Checking V4.5 files in $root"
Get-Content .\BUILD-ID.txt
Get-ChildItem .\jspp.js,.\js\engine.js,.\csspp.css,.\index.html | Select Name,Length,LastWriteTime
