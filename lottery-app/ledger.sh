#!/bin/bash
set -e

# Function to generate a new identity and return its principal
generate_identity() {
    local name=$1
    dfx identity new "$name" --storage-mode=plaintext || true
    dfx identity use "$name"
    dfx identity get-principal
}

# Function to get account ID from principal
get_account_id() {
    local principal=$1
    dfx ledger account-id --of-principal "$principal"
}

echo "Checking dependencies..."
# Check for required commands
RREQUIRED_COMMANDS="dfx cargo candid-extractor curl jq"

for cmd in $REQUIRED_COMMANDS; do
    if ! command -v $cmd >/dev/null 2>&1; then
        case $cmd in
            "dfx")
                echo "dfx is required but not installed. Please install dfx: https://internetcomputer.org/docs/current/developer-docs/setup/install/" >&2
                ;;
            "cargo")
                echo "cargo is required but not installed. Please install Rust: https://rustup.rs/" >&2
                ;;
            "candid-extractor")
                echo "candid-extractor is required but not installed. Please install: cargo install candid-extractor" >&2
                ;;
            "curl")
                echo "curl is required but not installed. Please install curl: sudo apt-get install curl"
                ;;
            "jq")
                echo "jq is required but not installed. Please install jq: sudo apt-get install jq"
                ;;
        esac
        exit 1
    fi
done


dfxvm default 0.24.3

# Stop dfx and clean up all state
# PID=$(lsof -i :4943)
# if [ -n "$PID" ]; then
#     echo "Found process on port 4943 (PID: $PID). Killing it..."
#     kill -9 $PID
#     echo "Process on port 4943 killed successfully."
# else
#     echo "No process found on port 4943."
# fi

dfx stop
rm -rf .dfx
rm -rf ~/.config/dfx/replica-configuration/
rm -rf ~/.config/dfx/identity/minting
rm -rf ~/.config/dfx/identity/initial
rm -rf ~/.config/dfx/identity/archive
rm -rf ~/.config/dfx/identity/user1
rm -rf ~/.config/dfx/identity/user2
rm -rf ~/.config/dfx/identity/user3
rm -rf ~/.cache/dfinity/
rm -rf ~/.config/dfx/
dfxvm default 0.24.3
# Remove canister_ids.json if it exists
if [ -f "canister_ids.json" ]; then
    rm canister_ids.json
fi

# Generate minting account
dfx identity new minting --storage-mode=plaintext || true
dfx identity use minting
MINTING_PRINCIPAL=$(dfx identity get-principal)
MINTING_ACCOUNT=$(get_account_id "$MINTING_PRINCIPAL")

# Generate initial account
dfx identity new initial --storage-mode=plaintext || true
dfx identity use initial
INITIAL_PRINCIPAL=$(dfx identity get-principal)
INITIAL_ACCOUNT=$(get_account_id "$INITIAL_PRINCIPAL")

# Generate archive controller account
dfx identity new archive --storage-mode=plaintext || true
dfx identity use archive
ARCHIVE_PRINCIPAL=$(dfx identity get-principal)

# Generate test recipient account
dfx identity new recipient --storage-mode=plaintext || true
dfx identity use recipient
RECIPIENT_PRINCIPAL=$(dfx identity get-principal)

# Generate user1 account
dfx identity new user1 --storage-mode=plaintext || true
dfx identity use user1
USER1_PRINCIPAL=$(dfx identity get-principal)
USER1_ACCOUNT=$(get_account_id "$USER1_PRINCIPAL")

# Generate user2 account
dfx identity new user2 --storage-mode=plaintext || true
dfx identity use user2
USER2_PRINCIPAL=$(dfx identity get-principal)
USER2_ACCOUNT=$(get_account_id "$USER2_PRINCIPAL")

# Generate user3 account
dfx identity new user3 --storage-mode=plaintext || true
dfx identity use user3
USER3_PRINCIPAL=$(dfx identity get-principal)
USER3_ACCOUNT=$(get_account_id "$USER3_PRINCIPAL")

# Switch back to default identity
dfx identity use default

# Start dfx with clean state
dfx start --clean --background

dfx identity use default

# Create initial identity if needed
dfx identity new --storage-mode=plaintext minting || true
dfx identity use minting

echo "Creating and deploying canister..."
dfx canister create context_contract
dfx canister create icp_ledger_canister
dfx canister create mock_external
dfx canister create LOTTERY_APP_backend

# Get the context ID
CONTEXT_ID=$(dfx canister id context_contract)
# Get the wallet ID and seed it
WALLET_ID=$(dfx identity get-wallet)

# Fabricate cycles for the wallet
dfx ledger fabricate-cycles --canister $WALLET_ID --amount 200000

# Transfer cycles from wallet to context contract
dfx canister deposit-cycles 1000000000000000000 $CONTEXT_ID

echo "Done! Cycles transferred to context contract: $CONTEXT_ID"

# Get the IDs
CONTEXT_ID=$(dfx canister id context_contract)
LEDGER_ID=$(dfx canister id icp_ledger_canister)

# Prepare ledger initialization argument
LEDGER_INIT_ARG="(variant { Init = record { 
    minting_account = \"${MINTING_ACCOUNT}\"; 
    initial_values = vec { 
        record { \"${INITIAL_ACCOUNT}\"; record { e8s = 100_000_000_000 } }; 
        record { \"${USER1_ACCOUNT}\"; record { e8s = 75_000_000_000 } }; 
        record { \"${USER2_ACCOUNT}\"; record { e8s = 75_000_000_000 } };
        record { \"${USER3_ACCOUNT}\"; record { e8s = 75_000_000_000 } }
    }; 
    send_whitelist = vec {}; 
    transfer_fee = opt record { e8s = 10_000 }; 
    token_symbol = opt \"LICP\"; 
    token_name = opt \"Local Internet Computer Protocol Token\"; 
    archive_options = opt record { 
        trigger_threshold = 2000; 
        num_blocks_to_archive = 1000; 
        controller_id = principal \"${ARCHIVE_PRINCIPAL}\" 
    }; 
} })"

# Build and install canisters
dfx build

# First install the ledger canister
dfx canister install icp_ledger_canister --mode=install --argument "$LEDGER_INIT_ARG"

# Get the ledger ID and install context contract with it
LEDGER_ID=$(dfx canister id icp_ledger_canister)
dfx canister install context_contract --mode=install --argument "(principal \"${LEDGER_ID}\")"

# Install mock external canister
dfx canister install mock_external --mode=install --argument "(principal \"${LEDGER_ID}\")"
MOCK_EXTERNAL_ID=$(dfx canister id mock_external)

# Install the backend canister
dfx canister install LOTTERY_APP_backend --mode=install
BACKEND_CANISTER=$(dfx canister id LOTTERY_APP_backend)
BACKEND_URL=$(dfx canister url LOTTERY_APP_backend)

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Build path relative to the script location
WASM_FILE="${SCRIPT_DIR}/context-proxy/calimero_context_proxy_icp.wasm"

# Verify file exists
if [ ! -f "$WASM_FILE" ]; then
    echo "Error: WASM file not found at: $WASM_FILE"
    exit 1
fi

# Then modify the script to use a consistent reading method
WASM_CONTENTS=$(xxd -p "$WASM_FILE" | tr -d '\n' | sed 's/\(..\)/\\\1/g')

# Execute the command using the temporary file
dfx canister call context_contract set_proxy_code --argument-file <(
  echo "(
    blob \"${WASM_CONTENTS}\"
  )"
)

# deploy the node backend
# node ../rsa-encryption-app/server.js

# Move the did file to frontend folder

# Print all relevant information at the end
echo -e "\n=== Deployment Summary ==="
echo "Context_Contract_ID=${CONTEXT_ID}" >> ../logic/node_vars.env
echo "Ledger_Contract_ID=${LEDGER_ID}" >> ../logic/node_vars.env
echo "Backend_Canister_Contract_ID=${BACKEND_CANISTER}" >> ../logic/node_vars.env
echo "Url_for_Backend_Canister=${BACKEND_URL}" >> ../logic/node_vars.env
echo "Demo_External_Contract_ID=${MOCK_EXTERNAL_ID}" >> ../logic/node_vars.env
echo -e "\nAccount Information:" 
echo "Minting_Account=${MINTING_ACCOUNT}" >> ../logic/node_vars.env
echo "Initial_Account=${INITIAL_ACCOUNT}" >> ../logic/node_vars.env
echo "Archive_Principal=${ARCHIVE_PRINCIPAL}" >> ../logic/node_vars.env
echo "Recipient_Principal=${RECIPIENT_PRINCIPAL}" >> ../logic/node_vars.env
echo "User1_Principal=${USER1_PRINCIPAL}" >> ../logic/node_vars.env
echo "User2_Principal=${USER2_PRINCIPAL}" >> ../logic/node_vars.env
echo "User3_Principal=${USER3_PRINCIPAL}" >> ../logic/node_vars.env
echo -e "\nDeployment completed successfully!" 