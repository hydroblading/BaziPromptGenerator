@echo off
chcp 65001 >nul
echo ========================================
echo 启动公开访问服务器
echo ========================================
echo.
echo 这将启动服务器和 ngrok 隧道
echo 服务器将在后台运行
echo.
cd /d "%~dp0"
if exist "bazi-mcp-dev" (
    cd bazi-mcp-dev
)

echo 正在启动服务器...
start "Bazi Server" cmd /c "npm run dev"

echo 等待服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo 正在启动 ngrok 隧道...
echo 请复制显示的公共 URL 来访问您的网页
echo.
call npx ngrok@latest http 3000

pause

