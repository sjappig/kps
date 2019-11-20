#!/bin/sh

npx truffle migrate --network=local --reset
npx truffle networks --network=local | node tools/grepContractAddress.js | echo VUE_APP_CONTRACT_ADDRESS=$(cat -) > .env.local
