#!/bin/bash

echo "📦 Installing dependencies for all services..."

services=("auth-service" "user-service" "notes-service" "workspace-service")

for service in "${services[@]}"; do
    echo "➡️ Installing in $service..."
    cd ../services/$service || exit
    npm install
    cd - >/dev/null || exit
done

echo "✅ All dependencies installed!"