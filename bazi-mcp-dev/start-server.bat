@echo off
chcp 65001 >nul
echo 正在启动服务器...
cd /d "%~dp0"
if exist "bazi-mcp-dev" (
    cd bazi-mcp-dev
)
call npm run dev
pause

