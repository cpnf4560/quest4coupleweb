@echo off
echo ========================================
echo VERIFICAR PROPAGACAO NAMESERVERS
echo ========================================
echo.

echo [1/4] Verificando NS atuais...
nslookup -type=NS quest4couple.pt 8.8.8.8
echo.
echo ESPERADO: dns1.host-redirect.com, dns2.host-redirect.com, etc.
echo.
pause

echo [2/4] Verificando A record (apex)...
nslookup quest4couple.pt 8.8.8.8
echo.
echo ESPERADO: Address: 75.2.60.5
echo.
pause

echo [3/4] Verificando CNAME (www)...
nslookup www.quest4couple.pt 8.8.8.8
echo.
echo ESPERADO: CNAME para admirable-dragon-bf9108.netlify.app
echo.
pause

echo [4/4] Verificando MX (email)...
nslookup -type=MX quest4couple.pt 8.8.8.8
echo.
echo ESPERADO: mail exchanger = mail.quest4couple.pt
echo.

echo ========================================
echo VERIFICACAO CONCLUIDA
echo ========================================
echo.
echo Se os resultados corresponderem ao esperado:
echo 1. Testar website: https://quest4couple.pt
echo 2. Verificar SSL (cadeado verde)
echo 3. Testar email (enviar/receber)
echo.
pause
