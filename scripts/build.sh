#!/usr/bin/env bash
set -e

echo "[build] 开始构建..."

# 构建 client
echo "[build] 构建 client..."
npx vite build

# 构建 server
echo "[build] 构建 server..."
npx tsc -p tsconfig.json

echo "[build] 构建完成"
