@echo off
chcp 65001 >nul
color 0D
cls

echo ╔════════════════════════════════════════════════════════╗
echo ║  🔒 MONITORIZAR SSL - QUEST4COUPLE.PT                 ║
echo ║  Verificação automática a cada 5 minutos              ║
echo ╚════════════════════════════════════════════════════════╝
echo.

:LOOP
echo ⏰ Verificação: %date% %time%
echo.

echo 📡 Testando conexão SSL...
powershell -Command "$request = [System.Net.WebRequest]::Create('https://quest4couple.pt'); try { $response = $request.GetResponse(); Write-Host '✅ SSL ATIVO - Site funcional!' -ForegroundColor Green; $response.Close(); exit 0 } catch { Write-Host '❌ SSL ainda não ativo' -ForegroundColor Red; Write-Host '   Erro:' $_.Exception.Message -ForegroundColor Yellow; exit 1 }"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════╗
    echo ║  🎉 SUCESSO! SITE TOTALMENTE FUNCIONAL!               ║
    echo ╚════════════════════════════════════════════════════════╝
    echo.
    echo 🌐 Abrir site: https://quest4couple.pt
    echo.
    echo Pressionar qualquer tecla para sair...
    pause >nul
    exit
)

echo.
echo ════════════════════════════════════════════════════════
echo.
echo 💡 DICAS:
echo    1. Verificar Netlify Dashboard → HTTPS
echo    2. Procurar botão "Verify DNS configuration"
echo    3. O SSL pode demorar até 60 minutos após DNS propagar
echo.
echo ⏳ Próxima verificação em 5 minutos...
echo    (Ctrl+C para sair)
echo.
echo ════════════════════════════════════════════════════════
timeout /t 300 /nobreak >nul
cls
goto LOOP
