#!/bin/bash

source ../logic/node_vars.env

# Function for checking balance
balance() {
    if [ -z "$1" ]; then
        echo "No address provided!"
        exit 1
    fi

    local princ=$1
    local bal
    bal=$(dfx canister call $Ledger_Contract_ID icrc1_balance_of '(
      record {
        owner = principal "'"$princ"'";
        subaccount = null;
      }
    )' | awk -F'"' '{print $2}' | tr -d '()')

    echo "$bal"
}

# Function for funding
fund_princ() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: fund_princ <principal> <amount>"
        exit 1
    fi

    local princ=$1
    local amt=$2

    # Get initial balance
    initial_balance=$(balance "$princ")
    echo "Initial balance of $princ: $initial_balance"

    # Execute the transfer
    dfx canister call $Ledger_Contract_ID icrc1_transfer '(
      record {
        to = record {
          owner = principal "'"$princ"'";
          subaccount = null;
        };
        amount = '"$amt"';
        fee = null;
        memo = null;
        from_subaccount = null;
        created_at_time = null;
      }
    )'

    # Get final balance
    final_balance=$(balance "$princ")
    echo "Final balance of $princ: $final_balance"

    # Check if transfer was successful
    expected_balance=$((initial_balance + amt))
    if [ "$final_balance" -eq "$expected_balance" ]; then
        echo "Successfully funded $princ with amount $amt"
    else
        echo "Funding may have failed. Expected: $expected_balance, Got: $final_balance"
    fi
}

# Check if function argument is provided
if [ -z "$1" ]; then
    echo "No function name provided!"
    exit 1
fi

# Execute function based on first argument
case $1 in
    fund_princ)
        fund_princ "$2" "$3"
        ;;
    balance)
        balance "$2"
        ;;
    *)
        echo "Function '$1' is not defined."
        exit 1
        ;;
esac
