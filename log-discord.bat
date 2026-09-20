@echo off
REM Launches Discord with the renderer console logged to a file,
REM so a gray screen / reload leaves evidence behind.
REM Close Discord first: flags only apply at launch.
setlocal

tasklist /fi "imagename eq Discord.exe" 2>nul | find /i "Discord.exe" >nul && (
    echo Discord is already running - close it first, then run this again.
    exit /b 1
)

set LOGDIR=%LOCALAPPDATA%\Temp\opencode
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul
set LOGFILE=%LOGDIR%\discord-console.log

if exist "%LOGFILE%" move /Y "%LOGFILE%" "%LOGDIR%\discord-console-prev.log" >nul

for /f "delims=" %%D in ('dir /b /ad /o-n "%LOCALAPPDATA%\Discord\app-*" 2^>nul') do (
    set APPDIR=%LOCALAPPDATA%\Discord\%%D
    goto :found
)
echo Discord app folder not found under %LOCALAPPDATA%\Discord.
exit /b 1

:found
start "" "%APPDIR%\Discord.exe" --enable-logging --log-file="%LOGFILE%"
echo Discord started - console goes to %LOGFILE%
