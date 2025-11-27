@echo off
chcp 65001 >nul
echo ========================================
echo 启动 ngrok 隧道
echo ========================================
echo.
echo 请确保服务器已经在运行（端口 3000）
echo.
echo 提示: 如果您有 ngrok 固定域名，可以编辑此文件
echo 将最后一行改为: npx ngrok@latest http 3000 --domain=您的域名
echo.
cd /d "%~dp0"
if exist "bazi-mcp-dev" (
    cd bazi-mcp-dev
)
call npx ngrok@latest http 3000
pause

