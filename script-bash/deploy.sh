#!/bin/bash

echo "Deploying"

# To load the variables in the .env file
source .env

# To deploy and verify our contract
forge script script/DeShop.s.sol:DeShopScript --rpc-url $JSON_RPC_URL --broadcast -vvvv
