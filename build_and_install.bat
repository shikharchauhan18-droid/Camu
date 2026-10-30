@echo off
setlocal EnableExtensions

REM Project root (folder containing this script)
set "PROJECT_ROOT=%~dp0"
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"
cd /d "%PROJECT_ROOT%"

REM Android SDK (edit if your SDK is elsewhere)
set "ANDROID_HOME=C:\android-sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"

set "APK=%PROJECT_ROOT%\android\app\build\outputs\apk\debug\app-debug.apk"

echo ========================================
echo  Mycamu - Build and Install on Phone
echo ========================================
echo Project: %PROJECT_ROOT%
echo.

echo [1/4] Building Next.js static export...
call npm run build
if errorlevel 1 (
    echo ERROR: npm run build failed.
    goto :fail
)

echo.
echo [2/4] Syncing web assets to Android (Capacitor)...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: cap sync failed.
    goto :fail
)

echo.
echo [3/4] Building debug APK (Gradle)...
cd /d "%PROJECT_ROOT%\android"
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo ERROR: Gradle assembleDebug failed.
    cd /d "%PROJECT_ROOT%"
    goto :fail
)
cd /d "%PROJECT_ROOT%"

if not exist "%APK%" (
    echo ERROR: APK not found at:
    echo   %APK%
    goto :fail
)

echo.
echo [4/4] Installing on connected device...
adb devices
echo.
adb install -r "%APK%"
if errorlevel 1 (
    echo ERROR: adb install failed.
    echo - Enable USB debugging on the phone
    echo - Connect via USB and accept the debugging prompt
    echo - Run: adb devices  (device must show as "device")
    goto :fail
)



:end
pause
endlocal
