#!/bin/bash

echo "Starting CareerConnect development server..."
echo ""

cd "$(dirname "$0")"

# Try to find and use npm
if command -v npm &> /dev/null; then
    echo "Found npm, starting server..."
    npm run dev
elif [ -f ~/.nvm/nvm.sh ]; then
    echo "Loading nvm and starting server..."
    source ~/.nvm/nvm.sh
    nvm use default
    npm run dev
elif [ -f /usr/local/bin/npm ]; then
    echo "Using npm from /usr/local/bin..."
    /usr/local/bin/npm run dev
elif [ -f /opt/homebrew/bin/npm ]; then
    echo "Using npm from /opt/homebrew/bin..."
    /opt/homebrew/bin/npm run dev
else
    echo "❌ Error: npm not found!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Or install via Homebrew: brew install node"
    echo ""
    echo "After installing, run: npm run dev"
    exit 1
fi

