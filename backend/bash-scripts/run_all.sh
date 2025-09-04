#!/bin/bash

echo "🚀 Starting all services..."

declare -A commands
commands["auth-service"]="npm run dev:auth"
commands["user-service"]="npm run dev:user"
commands["notes-service"]="npm run dev:notes"
commands["workspace-service"]="npm run dev:workspace"

for service in "${!commands[@]}"; do
    echo "➡️ Installing in $service..."
    cd ../services/$service || exit
    ${commands[$service]}
    cd - >/dev/null || exit
done

wait # keeps script alive until all background processes end

echo "✅ All services are running!"
