#!/bin/bash

# Start development server script
cd "$(dirname "$0")"

# Try to find npm in common locations
if command -v npm &> /dev/null; then
    npm run dev
elif [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use default
    npm run dev
elif [ -f /usr/local/bin/npm ]; then
    /usr/local/bin/npm run dev
elif [ -f /opt/homebrew/bin/npm ]; then
    /opt/homebrew/bin/npm run dev
else
    echo "Error: npm not found. Please install Node.js or ensure npm is in your PATH."
    echo "You can install Node.js from: https://nodejs.org/"
    exit 1
fi

