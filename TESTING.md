# Mini DEX Testing

## Setup
1. Install dependencies: `npm install`
2. Compile contracts: `npm run compile`

## Run Tests
- Standard: `npm test`
- Gas report: `REPORT_GAS=true npm test`

## Coverage Tips
- Extend swap and liquidity cases with multiple token pairs.
- Add fuzz cases for extreme inputs.
- Include revert-path tests for invalid token addresses.

## Notes
- Gas reports require `hardhat-gas-reporter` and run on tests.
- If you add new contracts, add corresponding test suites.
