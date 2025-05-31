@echo off
chcp 65001 > nul
echo.
echo 🚀 启动京东数据大屏服务器...
echo ============================================

:: 检查Node.js是否安装
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Node.js 未安装或不在系统PATH中
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 版本: 
node --version

:: 切换到服务器目录
cd /d "%~dp0server"
echo 📍 当前目录: %CD%

:: 检查文件是否存在
if not exist "server.js" (
    echo ❌ 错误：server.js 文件不存在
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ 错误：package.json 文件不存在
    pause
    exit /b 1
)

:: 检查端口是否被占用
echo 🔍 检查端口3000是否被占用...
netstat -an | findstr ":3000" > nul
if not errorlevel 1 (
    echo ⚠️ 警告：端口3000已被占用
    echo 正在尝试关闭占用该端口的进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /f /pid %%a > nul 2>&1
    )
    timeout /t 2 > nul
)

:: 安装依赖（如果需要）
if not exist "node_modules" (
    echo 📦 安装依赖包...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo 🔧 启动Node.js服务器...
echo ============================================
echo 📡 服务器地址: http://localhost:3000
echo 🌍 前端地址: 在浏览器中打开 ../index.html
echo 🔍 验证页面: 在浏览器中打开 ../verify_map.html
echo ============================================
echo.

:: 启动服务器
node server.js

if errorlevel 1 (
    echo.
    echo ❌ 服务器启动失败
    echo 请检查错误信息并修复问题
    pause
)

echo.
echo 服务器已停止
pause 