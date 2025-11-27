@echo off
chcp 65001 >nul
echo ========================================
echo 启动 ngrok 隧道 (固定域名)
echo ========================================
echo.
echo 请确保服务器已经在运行（端口 3000）
echo.
echo 注意: 请先编辑此文件，将 YOUR_DOMAIN 替换为您的 ngrok 固定域名
echo 例如: your-app.ngrok-free.app
echo.
cd /d "%~dp0"
if exist "bazi-mcp-dev" (
    cd bazi-mcp-dev
)

REM 请将下面的 YOUR_DOMAIN 替换为您的实际域名
set NGROK_DOMAIN=YOUR_DOMAIN

if "%NGROK_DOMAIN%"=="YOUR_DOMAIN" (
    echo.
    echo 错误: 请先编辑此文件，设置您的 ngrok 固定域名！
    echo.
    pause
    exit /b 1
)

echo 使用固定域名: %NGROK_DOMAIN%
echo.
call npx ngrok@latest http 3000 --domain=%NGROK_DOMAIN%
pause

