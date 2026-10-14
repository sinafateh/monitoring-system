@echo off
setlocal
set "USERPROFILE=C:\Users\Electronic"
set "HOMEDRIVE=C:"
set "HOMEPATH=\Users\Electronic"
set "APPDATA=C:\Users\Electronic\AppData\Roaming"
set "LOCALAPPDATA=C:\Users\Electronic\AppData\Local"
set "PM2_HOME=C:\Users\Electronic\.pm2"
set "PATH=C:\Program Files\nodejs;C:\Users\Electronic\AppData\Roaming\npm;%SystemRoot%\System32;%SystemRoot%"
cd /d "C:\Users\Electronic\Desktop\monitoring system"
>>"C:\Users\Electronic\.pm2\startup.log" echo.
>>"C:\Users\Electronic\.pm2\startup.log" echo ==== %DATE% %TIME% ====
>>"C:\Users\Electronic\.pm2\startup.log" echo USERPROFILE=%USERPROFILE% APPDATA=%APPDATA% PM2_HOME=%PM2_HOME%
"C:\Program Files\nodejs\node.exe" --version >>"C:\Users\Electronic\.pm2\startup.log" 2>&1
"C:\Program Files\nodejs\node.exe" "C:\Users\Electronic\AppData\Roaming\npm\node_modules\pm2\bin\pm2" resurrect >>"C:\Users\Electronic\.pm2\startup.log" 2>&1
set "rc=%ERRORLEVEL%"
>>"C:\Users\Electronic\.pm2\startup.log" echo PM2 resurrect exit code=%rc%
exit /b %rc%
