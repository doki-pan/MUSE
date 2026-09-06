#!/bin/bash

# 停止旧的服务器进程
pkill -f "node server.js" 2>/dev/null
sleep 1

# 启动服务器
cd "$(dirname "$0")"
node server.js &

echo "✅ MUSE 服务器已启动！"
echo ""
echo "📱 请在浏览器中打开:"
echo "   http://127.0.0.1:4173"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务器"
echo ""

# 等待服务器进程
wait
