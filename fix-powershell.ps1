# 修复 PowerShell 执行策略问题
# 以管理员身份运行此脚本

Write-Host "正在检查当前执行策略..." -ForegroundColor Yellow
$currentPolicy = Get-ExecutionPolicy
Write-Host "当前执行策略: $currentPolicy" -ForegroundColor Cyan

Write-Host "`n正在设置执行策略为 RemoteSigned..." -ForegroundColor Yellow
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "`n执行策略已更新！" -ForegroundColor Green
Write-Host "现在可以运行 npm 和 npx 命令了。" -ForegroundColor Green

