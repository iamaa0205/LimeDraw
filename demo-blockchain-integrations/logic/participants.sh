#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <number_of_nodes>"
    exit 1
fi

NUM_NODES=$1

# Load environment variables from the file
source node_vars.env

for i in $(seq 2 $((NUM_NODES + 1))); do
    NEW_NODE_NAME="test$i"
    NEW_SERVER_PORT=$((4000 + i))
    NEW_SWARM_PORT=$((5000 + i))

    # Remove existing node directory if it exists
    if [ -d "$HOME/.calimero/$NEW_NODE_NAME" ]; then
        echo "Removing existing node directory for $NEW_NODE_NAME..."
        rm -rf "$HOME/.calimero/$NEW_NODE_NAME"
    fi

    echo "Initializing $NEW_NODE_NAME ..."
    merod --node-name $NEW_NODE_NAME init --server-port $NEW_SERVER_PORT --swarm-port $NEW_SWARM_PORT --protocol starknet >/dev/null 2>&1 &
    sleep 2

    echo "Starting $NEW_NODE_NAME ..."
    merod --node-name $NEW_NODE_NAME run >/dev/null 2>&1 &
    sleep 5

    echo "Generating new identity pair for $NEW_NODE_NAME ..."
    OUTPUT=$(meroctl --node-name $NEW_NODE_NAME identity generate)
    NODE_PUBLIC_KEY=$(echo "$OUTPUT" | grep "public_key:" | awk '{print $2}')
    NODE_PRIVATE_KEY=$(echo "$OUTPUT" | grep "private_key:" | awk '{print $2}')

    echo "Joining $NEW_NODE_NAME to the network ..."
    OUTPUT=$(meroctl --node-name test1 --output-format json context invite $LOTTERY_CONTEXT_ID $HOST_PUBLIC_KEY $NODE_PUBLIC_KEY)
    sleep 5
    JOIN_PAYLOAD=$(echo "$OUTPUT" | jq -r '.data')

    meroctl --node-name $NEW_NODE_NAME --output-format json context join $NODE_PRIVATE_KEY $JOIN_PAYLOAD
    sleep 5

    echo "NODE${i}_PK=$NODE_PUBLIC_KEY" >> node_vars.env
    echo "NODE${i}_SK=$NODE_PRIVATE_KEY" >> node_vars.env

    echo "$NEW_NODE_NAME joined the network!"
    echo "====================================="
    echo "$NEW_NODE_NAME Public Key: $NODE_PUBLIC_KEY"
    echo "$NEW_NODE_NAME Private Key: $NODE_PRIVATE_KEY"
    echo "====================================="
done