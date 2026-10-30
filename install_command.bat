@echo off
REM Set Android SDK path
set ANDROID_HOME=C:\android-sdk

REM Add platform-tools to PATH for this session
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

REM Install the APK
adb install "C:\mycamu\android\app\build\outputs\apk\debug\app-debug.apk"

REM Pause so you can see output
pause
