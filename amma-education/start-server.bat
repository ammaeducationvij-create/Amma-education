@echo off
title AMMA EDUCATION - DDU-GKY Web Server
cd /d "%~dp0"
echo ==========================================================
echo Starting AMMA EDUCATION Web Portal...
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
