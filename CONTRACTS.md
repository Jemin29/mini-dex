# Mini DEX Smart Contracts

## Contracts
- DexRouter
- LiquidityPool
- LPToken
- ERC20Mock
- SwapLogic (library)

## Responsibilities
### DexRouter
- Creates pools (owner only)
- Adds/removes liquidity
- Executes swaps
- Provides output quoting via reserves

### LiquidityPool
- Holds token reserves
- Mints/burns LP tokens
- Enforces AMM invariant with fees

### LPToken
- Represents liquidity provider shares
- Mint/burn restricted to pool

### ERC20Mock
- Mintable test token

### SwapLogic
- AMM pricing utilities: quote, getAmountOut, getAmountIn

## Key Functions
### DexRouter
- createPool(tokenA, tokenB, feeBps)
- addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline)
- removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline)
- swapExactTokensForTokens(tokenIn, tokenOut, amountIn, amountOutMin, to, deadline)
- getAmountOut(tokenIn, tokenOut, amountIn)

### LiquidityPool
- getReserves()
- mint(to)
- burn(to)
- swap(tokenIn, to, amountOutMin)
- sync()

## Events
- PoolCreated
- LiquidityAdded
- LiquidityRemoved
- SwapExecuted
- Mint
- Burn
- Swap
- Sync

## Modifiers
- onlyRouter (LiquidityPool)

## Access Control
- Router pool creation is owner-only
- Pool mint/burn/swap/sync restricted to router
- LPToken mint/burn restricted to pool

## Deployment Flow
1. Deploy DexRouter
2. Deploy ERC20Mock tokens
3. createPool(tokenA, tokenB, feeBps)
4. Add initial liquidity via router

## Contract Interaction Workflow
1. User approves token
2. Router transfers tokens to pool
3. Pool updates reserves and emits events

## Security Notes
- ReentrancyGuard on pool actions
- SafeERC20 used for transfers
- Slippage and deadline enforced in router
