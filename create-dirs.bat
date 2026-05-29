@echo off
setlocal

set BASE=d:\Web Application\ui_ux_promax

powershell.exe -NoProfile -Command ^
  "$b='%BASE%';" ^
  "$dirs=@('src\app','src\app\portfolio','src\app\portfolio\[slug]','src\app\services','src\app\pricing','src\app\contact','src\app\about','src\app\blog','src\app\faq','src\lib','src\types','src\data','src\components','src\components\layout','src\components\sections','src\components\ui','public\images');" ^
  "foreach($d in $dirs){New-Item -LiteralPath (Join-Path $b $d) -ItemType Directory -Force | Out-Null; Write-Host ('Created: '+$d)};" ^
  "Write-Host 'Done!'"

echo.
echo All directories created!
pause
