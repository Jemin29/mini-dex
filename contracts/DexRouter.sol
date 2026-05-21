// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { LiquidityPool } from "./LiquidityPool.sol";
import { SwapLogic } from "./SwapLogic.sol";

/// @title DexRouter
/// @notice Router for swaps and liquidity management
contract DexRouter is Ownable {
    using SafeERC20 for IERC20;

    error ZeroAddress();
    error InvalidToken();
    error PoolExists();
    error PoolNotFound();
    error DeadlineExpired();
    error InsufficientAmount();
    error InvalidFee();

    event PoolCreated(address indexed token0, address indexed token1, address pool, uint24 feeBps);
    event LiquidityAdded(
        address indexed provider,
        address indexed pool,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event LiquidityRemoved(
        address indexed provider,
        address indexed pool,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event SwapExecuted(
        address indexed trader,
        address indexed pool,
        address indexed tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address to
    );

    mapping(bytes32 => address) private pools;

    constructor(address owner_) Ownable(owner_) {}

    /// @notice Creates a new liquidity pool for a token pair
    function createPool(address tokenA, address tokenB, uint24 feeBps) external onlyOwner returns (address pool) {
        if (tokenA == address(0) || tokenB == address(0)) revert ZeroAddress();
        if (tokenA == tokenB) revert InvalidToken();
        if (feeBps >= 10_000) revert InvalidFee();

        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        bytes32 key = _pairKey(token0, token1);
        if (pools[key] != address(0)) revert PoolExists();

        LiquidityPool newPool = new LiquidityPool(token0, token1, feeBps, address(this));
        pool = address(newPool);
        pools[key] = pool;

        emit PoolCreated(token0, token1, pool, feeBps);
    }

    /// @notice Returns the pool address for a pair
    function getPool(address tokenA, address tokenB) public view returns (address pool) {
        (address token0, address token1) = _sortTokens(tokenA, tokenB);
        pool = pools[_pairKey(token0, token1)];
    }

    /// @notice Adds liquidity to a pool
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (to == address(0)) revert ZeroAddress();

        address pool = getPool(tokenA, tokenB);
        if (pool == address(0)) revert PoolNotFound();

        (amountA, amountB) = _addLiquidity(pool, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);

        IERC20(tokenA).safeTransferFrom(msg.sender, pool, amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, pool, amountB);

        liquidity = LiquidityPool(pool).mint(to);
        emit LiquidityAdded(msg.sender, pool, amountA, amountB, liquidity);
    }

    /// @notice Removes liquidity from a pool
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (to == address(0)) revert ZeroAddress();

        address pool = getPool(tokenA, tokenB);
        if (pool == address(0)) revert PoolNotFound();

        address lpToken = address(LiquidityPool(pool).lpToken());
        IERC20(lpToken).safeTransferFrom(msg.sender, pool, liquidity);

        (uint256 amount0, uint256 amount1) = LiquidityPool(pool).burn(to);
        (address token0, ) = _sortTokens(tokenA, tokenB);
        if (tokenA == token0) {
            amountA = amount0;
            amountB = amount1;
        } else {
            amountA = amount1;
            amountB = amount0;
        }

        if (amountA < amountAMin || amountB < amountBMin) revert InsufficientAmount();
        emit LiquidityRemoved(msg.sender, pool, amountA, amountB, liquidity);
    }

    /// @notice Swaps exact input tokens for output tokens
    function swapExactTokensForTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut) {
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (to == address(0)) revert ZeroAddress();
        if (tokenIn == tokenOut) revert InvalidToken();

        address pool = getPool(tokenIn, tokenOut);
        if (pool == address(0)) revert PoolNotFound();

        IERC20(tokenIn).safeTransferFrom(msg.sender, pool, amountIn);
        amountOut = LiquidityPool(pool).swap(tokenIn, to, amountOutMin);

        emit SwapExecuted(msg.sender, pool, tokenIn, tokenOut, amountIn, amountOut, to);
    }

    /// @notice Returns output amount for a given input
    function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256) {
        address pool = getPool(tokenIn, tokenOut);
        if (pool == address(0)) revert PoolNotFound();

        (uint112 reserve0, uint112 reserve1, ) = LiquidityPool(pool).getReserves();
        (address token0, ) = _sortTokens(tokenIn, tokenOut);
        uint24 feeBps = LiquidityPool(pool).feeBps();

        if (tokenIn == token0) {
            return SwapLogic.getAmountOut(amountIn, reserve0, reserve1, feeBps);
        }
        return SwapLogic.getAmountOut(amountIn, reserve1, reserve0, feeBps);
    }

    function _addLiquidity(
        address pool,
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) private view returns (uint256 amountA, uint256 amountB) {
        (uint112 reserve0, uint112 reserve1, ) = LiquidityPool(pool).getReserves();
        (address token0, ) = _sortTokens(tokenA, tokenB);
        (uint256 reserveA, uint256 reserveB) = tokenA == token0
            ? (uint256(reserve0), uint256(reserve1))
            : (uint256(reserve1), uint256(reserve0));

        if (reserveA == 0 && reserveB == 0) {
            amountA = amountADesired;
            amountB = amountBDesired;
        } else {
            uint256 amountBOptimal = SwapLogic.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                if (amountBOptimal < amountBMin) revert InsufficientAmount();
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                uint256 amountAOptimal = SwapLogic.quote(amountBDesired, reserveB, reserveA);
                if (amountAOptimal > amountADesired) revert InsufficientAmount();
                if (amountAOptimal < amountAMin) revert InsufficientAmount();
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        }

        if (amountA < amountAMin || amountB < amountBMin) revert InsufficientAmount();
    }

    function _sortTokens(address tokenA, address tokenB) private pure returns (address token0, address token1) {
        if (tokenA == tokenB) revert InvalidToken();
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }

    function _pairKey(address token0, address token1) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(token0, token1));
    }
}
