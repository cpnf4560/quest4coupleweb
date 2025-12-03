@echo off
chcp 65001 >nul
color 0E
cls

:LOOP
echo ╔════════════════════════════════════════════════════════╗
echo ║  🔍 MONITORIZAÇÃO NS - QUEST4COUPLE.PT                ║
echo ║  Atualização automática a cada 5 minutos              ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⏰ Última verificação: %date% %time%
echo.

echo ┌────────────────────────────────────────────────────────┐
echo │ 📡 Nameservers Atuais (DNS Público):                  │
echo └────────────────────────────────────────────────────────┘
nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "nameserver"

echo.
echo ┌────────────────────────────────────────────────────────┐
echo │ 🎯 Estado:                                             │
echo └────────────────────────────────────────────────────────┘

nslookup -type=NS quest4couple.pt 8.8.8.8 2>nul | findstr "host-redirect" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ SUCESSO! Nameservers propagaram para host-redirect.com
    echo.
    echo Verificando IP do domínio...
    nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "Address" | findstr /V "8.8.8.8"
    echo.
    nslookup quest4couple.pt 8.8.8.8 2>nul | findstr "75.2.60.5" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ IP CORRETO! Site deve estar funcional!
        echo 🌐 Testar: https://quest4couple.pt
        echo.
        echo Pressionar qualquer tecla para sair...
        pause >nul
        exit
    ) else (
        echo ⚠️  Nameservers OK mas IP ainda não atualizou
        echo    Aguardar mais 30-60 minutos
    )
) else (
    echo ❌ AINDA EM DNSCPANEL.COM
    echo.
    echo 📋 Verificações:
    echo    1. No painel, confirmar que selecionou "Usar nameservers padrão"
    echo    2. Clicar "Alterar Nameservers" (botão azul)
    echo    3. Aguardar 15-30 minutos após guardar
    echo.
    echo ⏳ Próxima verificação em 5 minutos...
)

echo.
echo ════════════════════════════════════════════════════════
timeout /t 300 /nobreak >nul
cls
goto LOOP
