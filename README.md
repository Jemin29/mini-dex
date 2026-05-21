# Mini DEX

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow)](https://hardhat.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

Production-grade Mini DEX with AMM pools, a router, and a modern Web3 frontend.

## Overview
Mini DEX is a compact, auditable AMM-based exchange supporting ERC20 swaps, liquidity provision, and analytics.

## Features
- ERC20 swaps with slippage protection
- Add/remove liquidity and LP token rewards
- On-chain price estimation and reserve tracking
- Wallet integration (MetaMask, WalletConnect, Coinbase Wallet)
- Transaction status UX and responsive dashboard

## Architecture
### DEX Architecture
- Router orchestrates swaps and liquidity
- Pool maintains reserves and mints LP tokens
- Swap pricing uses constant product AMM

### Smart Contracts
See [CONTRACTS.md](CONTRACTS.md) for full contract responsibilities and flows.

### AMM Model
Constant product invariant: $x \cdot y = k$.

## Tech Stack
- Solidity, Hardhat
- Next.js, TypeScript, TailwindCSS
- ethers.js, wagmi, RainbowKit

## Installation
1. Install dependencies: `npm install`
2. Install frontend deps: `cd frontend && npm install`

## Environment Variables
Backend/root: [.env.example](.env.example)
Frontend: [frontend/.env.example](frontend/.env.example)

## Smart Contract Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for the SCAI testnet guide.

## Frontend Setup
1. Configure [frontend/.env.example](frontend/.env.example)
2. Run `npm run dev` inside frontend

## Wallet Integration
- wagmi + RainbowKit with auto-reconnect and network switching
- Unsupported network detection in the UI

## Screenshots
<!-- Add screenshots in a /screenshots folder and link them here. -->

## Contract Addresses
| Network | Router | Pool | Token A | Token B |
| --- | --- | --- | --- | --- |
| SCAI Testnet | TBD | TBD | TBD | TBD |

## Blockchain Network Details
- Network: SCAI Testnet
- Chain ID: 7000
- RPC: https://rpc-testnet.scai.network
- Explorer: https://explorer-testnet.scai.network

## Testing
- Run tests: `npm test`
- Gas report: `REPORT_GAS=true npm test`
See [TESTING.md](TESTING.md).

## Gas Optimization
Contracts use cached storage reads and optimized math. See optimization notes in the audit and test suite.

## Security Considerations
- Reentrancy guards on pool actions
- Custom errors for clear revert paths
- Slippage and deadline enforcement

## Future Improvements
- Multi-hop swaps
- Fee tiers
- Governance and protocol fee switch

## AI Integration Possibilities
- Slippage risk alerts
- Liquidity recommendation assistant
- Anomaly detection for pool activity

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for contract deploy + Vercel steps.

## Contract Verification
See [DEPLOYMENT.md](DEPLOYMENT.md) for Hardhat verify commands.

## Demo
<!-- Add a demo URL once deployed. -->

## Contributing
1. Fork and create a feature branch
2. Add tests for changes
3. Open a PR with clear description

## License
MIT. See [LICENSE](LICENSE).
