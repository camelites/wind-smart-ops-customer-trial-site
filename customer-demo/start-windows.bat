@echo off
cd /d %~dp0
set PORT=3010
echo 风电智慧运维管理平台 PC 试用包
echo 请在浏览器访问 http://127.0.0.1:%PORT%
py -m http.server %PORT%
