@echo off
set PORT=8976
set URL="http://localhost:%PORT%"

echo ----------------------------------------------------
echo Starting web server for ./docs...
echo ----------------------------------------------------

REM Navigate into the /docs directory
cd ./docs

REM 1. Start the Python server in the background
START "Python Server" /B python3 -m http.server %PORT%

echo Server started. Waiting 2 seconds for it to boot...

REM 2. Wait 2 seconds for the server to initialize
timeout /t 2 /nobreak > nul

echo Opening %URL% in your default browser...

REM 3. Open the URL in the default system browser
start "" %URL%

REM Return to the original directory
cd ..

echo ----------------------------------------------------
echo Server is running. Access at: %URL%
echo.
echo IMPORTANT: CLOSE THIS TERMINAL WINDOW
echo             to stop the server.
echo ----------------------------------------------------