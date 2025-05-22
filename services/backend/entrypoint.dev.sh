#!/bin/sh
BASENAME=`basename "$0"`
echo "Running ${BASENAME}..."
cd /opt/source

# Install xdg-utils, required by Vitest UI
echo "Installing xdg-utils..."
apt-get update
apt-get install -y xdg-utils --fix-missing

# Install npm packages
echo "Running 'npm install', be patient please..."
npm install --loglevel verbose

# Run npm watch
echo "Running 'npm watch'..."
npm run watch

echo "Running ${BASENAME} done."
