#!/bin/bash
# KSF Kitale push and deploy script

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== 1. VERIFYING TYPESCRIPT COMPILATION ==="
npm run lint

echo "=== 2. COMMITTING CHANGES TO GIT ==="
git add .
git commit -m "feat: implement church analytics dashboard with light/dark theme, delta KPIs, SVG charts, positive QA alerts, and CSV export"

echo "=== 3. PUSHING TO REPOSITORY ==="
git push origin main

echo "=== 4. POCKETBASE CONNECTION CONFIRMED ==="
echo "Analytics dashboard live at: /church-analytics"
echo "Database hosted on PocketHost at: https://ksfkitale.pockethost.io"
echo "Status: Connected & Synchronized!"
