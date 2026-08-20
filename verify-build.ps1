Write-Host "[0xAeterNova] Verifying Build Integrity..." -ForegroundColor Cyan
Get-Content .\BUILD-ID.txt
Write-Host "`n[Git Working Tree Status]:" -ForegroundColor Yellow
git status --short
