#!/bin/sh

npx truffle migrate --reset
npx truffle networks | node tools/grepContractAddress.js | echo VUE_APP_CONTRACT_ADDRESS=$(cat -) > .env.local
