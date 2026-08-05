#!/usr/bin/env bash

# Stop Service
systemctl stop website

# Build Service
rm -rf .next
pnpm build

# Start Service
systemctl start website
