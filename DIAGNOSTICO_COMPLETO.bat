@echo off
chcp 65001 >nul
color 0A
cls

echo ╔════════════════════════════════════════════════════════╗
echo ║    🔍 DIAGNÓSTICO COMPLETO - QUEST4COUPLE.PT          ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 1️⃣  Nameservers Atuais (Registrar)                     │
echo └────────────────────────────────────────────────────────┘
nslookup -type=NS quest4couple.pt 8.8.8.8
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 2️⃣  IP do Domínio (DNS Público)                        │
echo └────────────────────────────────────────────────────────┘
nslookup quest4couple.pt 8.8.8.8
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 3️⃣  IP do WWW                                          │
echo └────────────────────────────────────────────────────────┘
nslookup www.quest4couple.pt 8.8.8.8
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 4️⃣  Teste Direto ao DNS host-redirect.com             │
echo └────────────────────────────────────────────────────────┘
nslookup quest4couple.pt dns1.host-redirect.com
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 5️⃣  Registos MX (Email)                                │
echo └────────────────────────────────────────────────────────┘
nslookup -type=MX quest4couple.pt 8.8.8.8
echo.

echo ╔════════════════════════════════════════════════════════╗
echo ║                     📊 ANÁLISE                         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Verificando nameservers...
nslookup -type=NS quest4couple.pt 8.8.8.8 | findstr /C:"host-redirect" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Nameservers: CORRETOS ^(host-redirect.com^)
) else (
    echo ❌ Nameservers: INCORRETOS ^(ainda em dnscpanel.com^)
    echo    ⏳ Aguardar propagação ou verificar configuração
)

echo.
echo Verificando IP do domínio...
nslookup quest4couple.pt 8.8.8.8 | findstr /C:"75.2.60.5" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ IP do site: CORRETO ^(75.2.60.5 - Netlify^)
) else (
    echo ❌ IP do site: INCORRETO
    echo    ⏳ Verificar configuração DNS ou aguardar propagação
)

echo.
echo Verificando IP do email...
nslookup mail.quest4couple.pt 8.8.8.8 | findstr /C:"94.126.169.39" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ IP do email: CORRETO ^(94.126.169.39^)
) else (
    echo ⚠️  IP do email: Verificar configuração
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                  🎯 RECOMENDAÇÕES                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

nslookup -type=NS quest4couple.pt 8.8.8.8 | findstr /C:"host-redirect" >nul
if %ERRORLEVEL% NEQ 0 (
    echo 🚨 AÇÃO NECESSÁRIA:
    echo    1. Verificar painel NAMESERVERS
    echo    2. Confirmar que está em "Usar nameservers padrão"
    echo    3. Verificar se registos NS na zona DNS foram apagados
    echo    4. Aguardar 2-6 horas e executar script novamente
) else (
    nslookup quest4couple.pt 8.8.8.8 | findstr /C:"75.2.60.5" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  Nameservers OK mas IP incorreto:
        echo    1. Verificar registo A na zona DNS
        echo    2. Confirmar: quest4couple.pt → 75.2.60.5
        echo    3. Aguardar 1-2 horas propagação
    ) else (
        echo ✅ TUDO CORRETO! 
        echo    Testar: https://quest4couple.pt
        echo    Se ainda der erro SSL, limpar cache do browser
    )
)

echo.
echo ════════════════════════════════════════════════════════
echo  Executado: %date% %time%
echo ════════════════════════════════════════════════════════
echo.
pause
