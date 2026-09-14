#!/usr/bin/env bash
set -e

echo "[start] 启动生产模式..."

if [ -f "dist/server/main.js" ]; then
  node dist/server/main.js
else
  echo "[start] 未找到构建产物，请先运行 npm run build"
  exit 1
fi
