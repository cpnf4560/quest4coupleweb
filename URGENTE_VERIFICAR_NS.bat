@echo off
chcp 65001 >nul
color 0C
cls

echo ╔════════════════════════════════════════════════════════╗
echo ║  🚨 VERIFICAÇÃO URGENTE - NAMESERVERS                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

:LOOP
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║  🔍 MONITORIZAR MUDANÇA NS - QUEST4COUPLE.PT          ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⏰ %date% %time%
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 📡 Nameservers Atuais:                                 │
echo └────────────────────────────────────────────────────────┘
nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "nameserver"

echo.
echo ┌────────────────────────────────────────────────────────┐
echo │ 🎯 Análise:                                            │
echo └────────────────────────────────────────────────────────┘

nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "dnscpanel" >nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ AINDA EM DNSCPANEL.COM - ERRADO!
    echo.
    echo 🚨 AÇÃO NECESSÁRIA:
    echo    1. Ir ao painel dominios.pt
    echo    2. Clicar tab "NAMESERVERS"
    echo    3. Selecionar "Usar nameservers padrão"
    echo    4. Verificar: dns1.host-redirect.com
    echo    5. Clicar "Alterar Nameservers"
    echo    6. Aguardar confirmação
) else (
    nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "host-redirect" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ SUCESSO! NS em host-redirect.com
        echo.
        echo Verificando IP...
        nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
        if %ERRORLEVEL% EQU 0 (
            echo ✅ IP correto: 75.2.60.5
            echo.
            echo 🎉 DNS OK! Aguardar SSL provisionar (30-60 min)
            echo    Executar: MONITORIZAR_SSL.bat
            echo.
            pause
            exit
        )
    ) else (
        echo ⚠️  Nameservers desconhecidos
        nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul
    )
)

echo.
echo ════════════════════════════════════════════════════════
echo ⏳ Próxima verificação em 2 minutos...
echo    (Ctrl+C para sair)
echo ════════════════════════════════════════════════════════
timeout /t 120 /nobreak >nul
goto LOOP
