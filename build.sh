#!/usr/bin/env bash

# Stop Service
systemctl stop website
echo "Website Service Stopped"

# Build Service
echo "Building Website Service..."
rm -rf .next
pnpm build
echo "Website Service Built"

# Start Service
systemctl start website
echo "Website Service Started"
