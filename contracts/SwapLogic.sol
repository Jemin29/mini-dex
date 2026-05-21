// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SwapLogic
/// @notice AMM math utilities for constant product pools
library SwapLogic {
    error InvalidAmount();
    error InsufficientLiquidity();
    error InvalidFee();

    uint256 internal constant FEE_DENOMINATOR = 10_000;

    /// @notice Quotes an equivalent amount of the other token
    /// @param amountA Amount of token A
    /// @param reserveA Reserve of token A
    /// @param reserveB Reserve of token B
    /// @return amountB Quoted amount of token B
    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) internal pure returns (uint256 amountB) {
        if (amountA == 0) revert InvalidAmount();
        if (reserveA == 0 || reserveB == 0) revert InsufficientLiquidity();
        amountB = (amountA * reserveB) / reserveA;
    }

    /// @notice Calculates output amount for an exact input swap
    /// @param amountIn Exact input amount
    /// @param reserveIn Reserve of input token
    /// @param reserveOut Reserve of output token
    /// @param feeBps Fee in basis points
    /// @return amountOut Output amount
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 feeBps
    ) internal pure returns (uint256 amountOut) {
        if (amountIn == 0) revert InvalidAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();
        if (feeBps >= FEE_DENOMINATOR) revert InvalidFee();

        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - feeBps);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /// @notice Calculates input amount required for an exact output swap
    /// @param amountOut Exact output amount
    /// @param reserveIn Reserve of input token
    /// @param reserveOut Reserve of output token
    /// @param feeBps Fee in basis points
    /// @return amountIn Input amount
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 feeBps
    ) internal pure returns (uint256 amountIn) {
        if (amountOut == 0) revert InvalidAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();
        if (amountOut >= reserveOut) revert InsufficientLiquidity();
        if (feeBps >= FEE_DENOMINATOR) revert InvalidFee();

        uint256 numerator = reserveIn * amountOut * FEE_DENOMINATOR;
        uint256 denominator = (reserveOut - amountOut) * (FEE_DENOMINATOR - feeBps);
        amountIn = (numerator / denominator) + 1;
    }
}
