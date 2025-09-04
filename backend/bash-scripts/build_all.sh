#!/bin/bash

echo "🏗️ Building all services..."

services=("auth-service" "user-service" "notes-service" "workspace-service")

for service in "${services[@]}"; do
    echo "➡️ Building $service..."
    cd ../services/$service || exit
    npm run build
    cd - >/dev/null || exit
done

echo "✅ All services build!"