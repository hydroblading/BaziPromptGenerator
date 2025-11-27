@echo off
chcp 65001 >nul
echo 正在启动 ngrok 隧道...
echo 请确保服务器已经在运行（端口 3000）
echo.
cd /d "%~dp0"
if exist "bazi-mcp-dev" (
    cd bazi-mcp-dev
)
call npx ngrok@latest http 3000
pause

