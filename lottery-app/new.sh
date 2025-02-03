#!/bin/bash
set -e

# 
get_proxy_contract() {
    local context_id=$1
    local result

    # Make the first request
    result=$(curl -s -X GET "http://localhost:2427/admin-api/contexts/${context_id}/proxy-contract" | jq -r '.data')

    # Check if result is null or empty
    if [ "$result" == "null" ] || [ -z "$result" ]; then
        echo "Data is null, making another request..."
        result=$(curl -s -X GET "http://localhost:2428/admin-api/contexts/${context_id}/alternative-endpoint" | jq -r '.data')
    fi

    # Store the result in a global environment variable
    # export PROXY_CONTRACT="$result"
    echo "Stored in PROXY_CONTRACT: $PROXY_CONTRACT"
    echo "$result"
}

# Function to get account ID from principal
get_account_id() {
    local principal=$1
    dfx ledger account-id --of-principal "$principal"
}

