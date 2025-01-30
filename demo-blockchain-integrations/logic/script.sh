#!/bin/bash
set -e

NODE_NAME="test1"
SERVER_PORT=4001
SWARM_PORT=5001

# Kill any existing merod processes
if pgrep -f merod > /dev/null; then
    echo "Killing existing merod processes..."
    pkill -f merod
    sleep 1
fi


# First check and remove existing node directory if it exists
if [ -d "$HOME/.calimero/$NODE_NAME" ]; then
    echo "Removing existing node directory..."
    rm -rf "$HOME/.calimero/$NODE_NAME"
fi

echo "Starting node setup..."

# Build the WASM
echo "Building WASM..."
cd "$(dirname $0)"

TARGET="${CARGO_TARGET_DIR:-target}"

# Add WASM target
rustup target add wasm32-unknown-unknown

# Build the project
cargo build --target wasm32-unknown-unknown --profile app-release

# Create res directory if it doesn't exist
mkdir -p res

# Get project name and create sanitized version
name=$(cargo read-manifest | jq -r '.name')
sanitized_name=$(echo $name | tr '-' '_')

# Copy the WASM file
cp "$TARGET/wasm32-unknown-unknown/app-release/$sanitized_name.wasm" ./res/

# Optimize WASM if wasm-opt is available
if command -v wasm-opt >/dev/null; then
    wasm-opt -Oz ./res/$sanitized_name.wasm -o ./res/$sanitized_name.wasm
fi

WASM_PATH="./res/$sanitized_name.wasm"

echo "WASM build complete!"

# Start the node initialization and run in background
echo "Initializing node..."
merod --node-name $NODE_NAME init --server-port $SERVER_PORT --swarm-port $SWARM_PORT >/dev/null 2>&1 &
sleep 1

echo "Starting node..."
merod --node-name $NODE_NAME run >/dev/null 2>&1 &
sleep 2

# Install application and capture ID
echo "Installing application..."
APP_ID=$(meroctl --node-name $NODE_NAME app install --path $WASM_PATH | grep "id:" | awk '{print $2}')
sleep 3

if [ -z "$APP_ID" ]; then
    echo "Failed to get application ID"
    exit 1
fi

# Create context and capture both ID and public key
echo "Creating context..."
CONTEXT_OUTPUT=$(meroctl --node-name $NODE_NAME context create --application-id $APP_ID)
CONTEXT_ID=$(echo "$CONTEXT_OUTPUT" | grep "id:" | awk '{print $2}')
MEMBER_PUBLIC_KEY=$(echo "$CONTEXT_OUTPUT" | grep "member_public_key:" | awk '{print $2}')
sleep 5

if [ -z "$CONTEXT_ID" ]; then
    echo "Failed to get context ID"
    exit 1
fi

# Store variables in a file
echo "NODE_NAME=$NODE_NAME" > node_vars.env
echo "SERVER_PORT=$SERVER_PORT" >> node_vars.env
echo "SWARM_PORT=$SWARM_PORT" >> node_vars.env
echo "APP_ID=$APP_ID" >> node_vars.env
echo "CONTEXT_ID=$CONTEXT_ID" >> node_vars.env
echo "MEMBER_PUBLIC_KEY=$MEMBER_PUBLIC_KEY" >> node_vars.env

# Print summary
echo "==============================================="
echo "Node is up and running!"
echo "Port: $SERVER_PORT"
echo "Application ID: $APP_ID"
echo "Context ID: $CONTEXT_ID"
echo "Member Public Key: $MEMBER_PUBLIC_KEY"
echo "==============================================="