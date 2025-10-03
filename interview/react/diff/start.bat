@echo off
echo 启动Diff算法演示程序...
echo.

echo 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo Node.js环境正常
echo.

echo 运行示例演示...
node example.js

echo.
echo 演示完成！
echo 按任意键退出...
pause >nul
