#!/usr/bin/env bash
set -e

# 开发模式：同时启动 server 与 client
echo "[dev] 启动开发模式..."
npm run dev:server &
npm run dev:client
