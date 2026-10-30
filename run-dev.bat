@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "REPO_ROOT=%~dp0"
set "RUNTIME_ROOT=%REPO_ROOT%.runtime"
set "PNPM_STORE=%RUNTIME_ROOT%\pnpm-store"
set "PNPM_HOME=%RUNTIME_ROOT%\pnpm-home"
set "REQUIRED_PNPM=10.22.0"
set "NODE_EXE="
set "PNPM_VERSION="

cd /d "%REPO_ROOT%"

echo ============================================================
echo  TMT - Isolated development environment
echo ============================================================

for /f "delims=" %%N in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%N"

if not defined NODE_EXE (
  echo [ERROR] Khong tim thay Node.js trong PATH.
  echo Cai Node.js 22 tro len, sau do chay lai file nay.
  pause
  exit /b 1
)

"%NODE_EXE%" -e "if (Number(process.versions.node.split('.')[0]) < 22) process.exit(1)"
if errorlevel 1 (
  echo [ERROR] Can Node.js 22 tro len.
  pause
  exit /b 1
)

where pnpm >nul 2>nul
if not errorlevel 1 (
  for /f "delims=" %%V in ('pnpm --version 2^>nul') do set "PNPM_VERSION=%%V"
)

if not "%PNPM_VERSION%"=="%REQUIRED_PNPM%" (
  echo [ERROR] Can pnpm %REQUIRED_PNPM%, nhung khong tim thay phien ban phu hop.
  echo pnpm hien tai: !PNPM_VERSION!
  echo Repository khai bao packageManager la pnpm@%REQUIRED_PNPM%.
  pause
  exit /b 1
)

if not exist "%RUNTIME_ROOT%" mkdir "%RUNTIME_ROOT%"
if not exist "%PNPM_STORE%" mkdir "%PNPM_STORE%"
if not exist "%PNPM_HOME%" mkdir "%PNPM_HOME%"

echo [INFO] Node:
"%NODE_EXE%" --version
echo [INFO] Node executable: %NODE_EXE%
echo [INFO] pnpm: !PNPM_VERSION!
echo [INFO] Isolated store: %PNPM_STORE%
echo.
echo [1/2] Installing dependencies from pnpm-lock.yaml...

set "TMT_PREVIOUS_CI=%CI%"
set "CI=true"
call pnpm install --frozen-lockfile --store-dir "%PNPM_STORE%"
set "INSTALL_EXIT=%ERRORLEVEL%"
set "CI=%TMT_PREVIOUS_CI%"

if not "%INSTALL_EXIT%"=="0" (
  echo.
  echo [ERROR] Cai dependency that bai.
  pause
  exit /b 1
)

echo.
echo [2/2] Starting Next.js development server...
echo Website: http://localhost:3000
echo Editor : http://localhost:3000/customize
echo Dung server bang Ctrl+C.
echo.

set "ENABLE_SITE_EDITOR=true"
set "NEXT_TELEMETRY_DISABLED=1"

call pnpm --filter web dev

set "DEV_EXIT=%ERRORLEVEL%"
if not "%DEV_EXIT%"=="0" (
  echo.
  echo [ERROR] Development server dung voi ma loi %DEV_EXIT%.
  pause
)

exit /b %DEV_EXIT%
