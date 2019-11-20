[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Actions Status](https://github.com/sjappig/kps/workflows/Test%20and%20lint/badge.svg)](https://github.com/sjappig/kps/actions)

# kps

Rock, paper, scissors implemented with Ethereum smart contract and VueJS frontend.

## Project setup
```
npm install
```

### Development environment

Development environment uses Truffle development blockchain and Webpack devserver. Application is served in port 8080. You will need two terminals open.

```
npm run serve-blockchain
```

```
npm run migrate-contracts
npm run serve
```

### Running tests and linters
```
npm test
npm run lint
```
