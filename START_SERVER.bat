@echo off
REM Quest4Couple - Iniciar Servidor Local
REM ========================================

echo.
echo ===============================================
echo   Quest4Couple - Servidor Local
echo ===============================================
echo.

cd /d "%~dp0"

echo [1/2] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Python nao encontrado!
    echo.
    echo Por favor instala Python de: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [2/2] Iniciando servidor HTTP na porta 8000...
echo.
echo ===============================================
echo   Servidor ATIVO!
echo ===============================================
echo.
echo   URL: http://localhost:8000/app.html
echo.
echo   Para PARAR: Prima Ctrl+C
echo ===============================================
echo.

python -m http.server 8000

pause
