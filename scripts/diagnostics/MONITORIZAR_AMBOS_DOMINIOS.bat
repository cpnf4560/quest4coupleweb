@echo off
chcp 65001 >nul
color 0B
cls

:LOOP
echo ╔════════════════════════════════════════════════════════╗
echo ║  🔍 MONITORIZAÇÃO DNS - AMBOS DOMÍNIOS                ║
echo ║  Atualização automática a cada 5 minutos              ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⏰ Última verificação: %date% %time%
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 🇵🇹 QUEST4COUPLE.PT                                     │
echo └────────────────────────────────────────────────────────┘
echo Nameservers:
nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "nameserver"
echo.
echo IP do domínio:
nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "Address" | findstr /V "8.8.8.8"
echo.

nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "host-redirect" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ .PT: Nameservers OK
    nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ .PT: IP correto - SITE FUNCIONAL!
    ) else (
        echo ⏳ .PT: Aguardar IP atualizar...
    )
) else (
    echo ❌ .PT: Ainda em dnscpanel.com
)

echo.
echo ════════════════════════════════════════════════════════
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 🌍 QUEST4COUPLE.COM                                    │
echo └────────────────────────────────────────────────────────┘
echo Nameservers:
nslookup -type=NS quest4couple.com 8.8.8.8 2>nul | findstr "nameserver"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Sem nameservers configurados
)
echo.
echo IP do domínio:
nslookup quest4couple.com 8.8.8.8 2>nul | findstr "Address" | findstr /V "8.8.8.8"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Sem DNS configurado
)
echo.

nslookup quest4couple.com 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ .COM: SITE FUNCIONAL!
) else (
    nslookup -type=NS quest4couple.com 8.8.8.8 2>nul | findstr "host-redirect" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ⏳ .COM: NS OK, aguardar IP propagar
    ) else (
        echo ❌ .COM: Configurar DNS no painel
    )
)

echo.
echo ════════════════════════════════════════════════════════
echo.

echo 📊 RESUMO:
echo.

:: Verificar .PT
nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ quest4couple.pt - FUNCIONAL
) else (
    echo ⏳ quest4couple.pt - Aguardando propagação
)

:: Verificar .COM
nslookup quest4couple.com 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ quest4couple.com - FUNCIONAL
) else (
    echo ⏳ quest4couple.com - Aguardando configuração/propagação
)

echo.
echo ⏳ Próxima verificação em 5 minutos...
echo    (Ctrl+C para sair)
echo.
echo ════════════════════════════════════════════════════════
timeout /t 300 /nobreak >nul
cls
goto LOOP
