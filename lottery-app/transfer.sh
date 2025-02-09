source ../logic/node_vars.env

chmod +x ./func.sh
dfx identity use user1
./func.sh fund_princ $PROXY_CONTRACT_ID1 100000

