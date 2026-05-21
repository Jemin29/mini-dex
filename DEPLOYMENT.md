# Mini DEX Deployment Guide (SCAI Testnet)

## 1) Environment Setup

Create `.env` in the project root:

```
DEPLOYER_PRIVATE_KEY=YOUR_PRIVATE_KEY
SCAI_TESTNET_RPC_URL=https://rpc-testnet.scai.network
SCAI_EXPLORER_API_KEY=YOUR_EXPLORER_API_KEY
```

Create `frontend/.env`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_APP_NAME=Mini DEX
NEXT_PUBLIC_CHAIN_ID=7000
NEXT_PUBLIC_RPC_URL=https://rpc-testnet.scai.network
NEXT_PUBLIC_ROUTER_ADDRESS=DEPLOYED_ROUTER_ADDRESS
NEXT_PUBLIC_POOL_ADDRESS=DEPLOYED_POOL_ADDRESS
```

## 2) Smart Contract Deployment

Install dependencies:

```
npm install
```

Deploy to SCAI Testnet:

```
npm run deploy:scai
```

Record the deployed addresses printed by the script.

## 3) Contract Verification

Verify contracts on SCAI Testnet explorer:

```
npm run verify:scai -- <contractAddress> <constructorArgs>
```

Example (router):

```
npm run verify:scai -- 0xRouterAddress "0xOwnerAddress"
```

Example (pool):

```
npm run verify:scai -- 0xPoolAddress "0xToken0" "0xToken1" 30 "0xRouter"
```

## 4) Frontend Deployment (Vercel)

1. Set Vercel project root to `frontend/`.
2. Add environment variables from `frontend/.env` in the Vercel dashboard.
3. Deploy.

## 5) Production Checklist

- Use a dedicated deployer key with minimal funds.
- Rotate keys after deployment.
- Never commit `.env` files.
- Confirm correct chain ID and RPC endpoints.
- Verify contracts with the explorer.
- Enable wallet connection on the correct network.
- Smoke-test swap + liquidity paths after deployment.
