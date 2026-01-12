#!/bin/bash

PORT=8976
URL="http://localhost:$PORT"

# Cleanup function to stop the server on CTRL+C
cleanup() {
    echo -e "\n\nStopping server (PID: $SERVER_PID)..."
    # Kill the server process
    kill $SERVER_PID
    exit
}

# Trap the INT signal (CTRL+C) and call the 'cleanup' function
trap cleanup INT

echo "----------------------------------------------------"
echo "Starting web server for ./docs"
echo "----------------------------------------------------"

# 1. Start the server in the background
(cd ./docs && python3 -m http.server $PORT) &

# 2. Save the server's Process ID (PID)
SERVER_PID=$!

echo "Server started (PID: $SERVER_PID). Waiting 2 seconds..."

# 3. Wait for 2 seconds
sleep 2

echo "Opening $URL in your default browser..."

# 4. Open in default browser (logic for macOS or Linux)
if [[ "$(uname -s)" == "Darwin" ]]; then
  # macOS command
  open "$URL"
else
  # Linux command
  xdg-open "$URL"
fi

echo "----------------------------------------------------"
echo "Server is running. Access at: $URL"
echo "Press CTRL+C in this terminal to stop."
echo "----------------------------------------------------"

# 'wait' keeps the script alive, listening for the 'trap'
wait $SERVER_PID