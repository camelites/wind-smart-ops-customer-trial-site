#!/bin/sh
cd "$(dirname "$0")"
PORT="${PORT:-3010}"
echo "风电智慧运维管理平台 PC 试用包"
echo "请在浏览器访问 http://127.0.0.1:${PORT}"
python3 -m http.server "$PORT"
