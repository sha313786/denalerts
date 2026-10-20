@echo off
title Live UPI Stream Alerts Server
cd /d "%~dp0"
echo ========================================================
echo     Starting Live UPI Stream Alerts Server...
echo ========================================================
echo.
node server.js
pause
