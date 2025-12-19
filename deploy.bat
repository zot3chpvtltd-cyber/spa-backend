@echo off
REM Hostinger Deployment Script for Windows
REM Run this script to prepare your backend for deployment

echo 🚀 Preparing backend for Hostinger deployment...
echo.

REM Step 1: Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ Please update .env with your Hostinger credentials
    pause
    exit /b 1
)

REM Step 2: Install dependencies
echo 📦 Installing production dependencies...
call npm install --production

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Step 3: Create deployment folder
echo 📦 Creating deployment package...
if not exist deployment mkdir deployment

REM Step 4: Create zip file (requires 7-Zip or WinRAR in PATH)
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo Creating backend-%TIMESTAMP%.zip...
powershell Compress-Archive -Path .\* -DestinationPath .\deployment\backend-%TIMESTAMP%.zip -Force -Exclude node_modules,.env,deployment,.git

if errorlevel 1 (
    echo ⚠️  Failed to create zip. Creating manual list instead...
    echo.
    echo Please manually upload these files/folders to Hostinger:
    echo - server.js
    echo - package.json
    echo - models/
    echo - routes/
    echo - middleware/
    echo - config/
    echo.
    echo DO NOT upload:
    echo - node_modules/
    echo - .env
    echo - .git/
) else (
    echo ✅ Deployment package created: deployment\backend-%TIMESTAMP%.zip
)

echo.
echo 📋 Next steps:
echo 1. Upload the zip file to Hostinger File Manager
echo 2. Extract it in public_html/api/
echo 3. Create .env file with production credentials
echo 4. SSH into Hostinger and run:
echo    cd ~/public_html/api
echo    npm install --production
echo    pm2 start server.js --name spa-backend
echo.
echo 🎉 Ready for deployment!
echo.
pause
