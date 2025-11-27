@echo off
echo ========================================
echo VERIFICAR DNS DO QUEST4COUPLE.PT
echo ========================================
echo.

echo [1/3] Verificando DNS local...
nslookup quest4couple.pt
echo.

echo [2/3] Verificando DNS Google (8.8.8.8)...
nslookup quest4couple.pt 8.8.8.8
echo.

echo [3/3] Verificando DNS Cloudflare (1.1.1.1)...
nslookup quest4couple.pt 1.1.1.1
echo.

echo ========================================
echo RESULTADO ESPERADO:
echo Address: 75.2.60.5
echo ========================================
echo.

echo Se mostrar 94.126.169.39, aguardar propagacao DNS!
echo.
pause
