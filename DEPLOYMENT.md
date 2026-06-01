# Mini DEX Deployment Guide (Production)

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

Create `backend/.env`:

```
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-domain
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
REDIS_URL=redis://your-redis-host:6379
CACHE_PROVIDER=redis
WS_PATH=/ws
LOG_FORMAT=combined
TRUST_PROXY=true
```

## 2) Smart Contract Deployment

Install dependencies:

```
npm install
```

Deploy to production network:

```
npm run deploy:prod -- --network sepolia
```

Record the deployed addresses printed by the script.

## 3) Contract Verification

Verify contracts on the explorer:

```
npm run verify:sepolia -- <contractAddress> <constructorArgs>
```

Example (router):

```
npm run verify:sepolia -- 0xRouterAddress "0xOwnerAddress" "0xFeeRecipient" 0
```

Example (pool):

```
npm run verify:sepolia -- 0xPoolAddress "0xToken0" "0xToken1" 30 "0xRouter"
```

## 4) Frontend Deployment (Vercel)

1. Set Vercel project root to `frontend/`.
2. Add environment variables from `frontend/.env` in the Vercel dashboard.
3. Enable "Automatic HTTPS" and "Production" environment variables.
4. Deploy.

## 5) Backend Deployment

1. Provision a Node.js host (VM, container, or managed platform).
2. Set `backend/.env` values securely.
3. Run `npm install`, then `npm run build` in `backend/`.
4. Start with a process manager (systemd, PM2) and enable log rotation.

## 6) RPC Providers

- Set `NEXT_PUBLIC_RPC_URL` or `NEXT_PUBLIC_RPC_URLS` with multiple endpoints.
- Use at least two providers for failover (for example, Alchemy + Infura).

## 7) Analytics Tracking

- Provide `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` and `NEXT_PUBLIC_ANALYTICS_SITE_ID` for your analytics vendor.
- Verify analytics script loads in production and respects privacy settings.

## 8) Monitoring + Logging

- Backend uses structured logging via `LOG_FORMAT`.
- Enable uptime checks and alerting on the backend and RPC providers.
- Track error rates and latency (APM of choice).

## 9) Production Checklist

- Use a dedicated deployer key with minimal funds.
- Rotate keys after deployment.
- Never commit `.env` files.
- Confirm correct chain ID and RPC endpoints.
- Verify contracts with the explorer.
- Enable wallet connection on the correct network.
- Smoke-test swap + liquidity paths after deployment.
- Run contract coverage and API/frontend test suites before release.
- Verify backend health endpoints and WebSocket connectivity.

## 10) CI/CD Recommendations

- Run `npm test` at repo root (contracts), `npm run coverage` for coverage.
- Run `npm test` in `frontend/` and `backend/`.
- Configure environment secrets in CI and Vercel.
- Require manual approval for production deploys.
