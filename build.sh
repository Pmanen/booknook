#!/usr/bin/env bash
set -euo pipefail

cd backend && npm install
cd ../frontend && npm install && npm run build

cp -r dist ../backend

cd ..
