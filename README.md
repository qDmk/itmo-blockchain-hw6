# Homework 4

#### _“DeFI, protocols code review”_

Contract [Flashloan.sol](contracts/Flashloan.sol) must be called from Uniswap V2 Pair with some amount of tokens loaned.
Then the contract performs cyclic path of swaps using Uniswap V2 Router function `swapExactTokensForTokens`.
Then returns the loan back with 4% fee.

### How to start

- (Optionally) Replace `demo` with your Alchemy API key in [`hardhat.config.ts`](hardhat.config.js)
- Run tests:
    ``` bash 
    npm install
    npx hardhat test
    ```

### Log example

```
  Flashloan
    Uniswap
      ✔ Should cycle swap (12625ms)

  1 passing (13s)
```