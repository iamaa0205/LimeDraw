#!/bin/bash

# function for funding 
encrypt() {
    dfx canister call <LEDGER_CONTRACT_ID> icrc1_transfer '(
  record {
    to = record {
      owner = principal "<PROXY_CONTRACT_ID>";
      subaccount = null;
    };
    amount = 1_000_000_000;
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
  }
)'
}

# Define function for decrypting
decrypt() {
    echo "Decryption function executed!"
    # Add decryption logic here
}

# Define function for adding records
add_record() {
    echo "Adding new records!"
    # Add logic for adding records here
}

# Check if function argument is provided
if [ -z "$1" ]; then
    echo "No function name provided!"
    exit 1
fi

# Execute function based on first argument
case $1 in
    encrypt)
        encrypt
        ;;
    decrypt)
        decrypt
        ;;
    add_record)
        add_record
        ;;
    *)
        echo "Function '$1' is not defined."
        exit 1
        ;;
esac
