// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

import { LPToken } from "./LPToken.sol";
import { SwapLogic } from "./SwapLogic.sol";

/// @title LiquidityPool
/// @notice Constant product AMM pool for a token pair
contract LiquidityPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error ZeroAddress();
    error InvalidToken();
    error NotRouter();
    error InsufficientLiquidityMinted();
    error InsufficientLiquidityBurned();
    error InsufficientOutputAmount();
    error InsufficientInputAmount();
    error InvalidFee();

    uint256 public constant MINIMUM_LIQUIDITY = 1_000;
    uint256 public constant VERSION = 1;

    address public immutable token0;
    address public immutable token1;
    address public immutable router;
    LPToken public immutable lpToken;
    uint24 public immutable feeBps;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    event Mint(address indexed sender, address indexed to, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Burn(address indexed sender, address indexed to, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Swap(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    modifier onlyRouter() {
        if (msg.sender != router) revert NotRouter();
        _;
    }

    constructor(address tokenA, address tokenB, uint24 feeBps_, address router_) {
        if (tokenA == address(0) || tokenB == address(0) || router_ == address(0)) revert ZeroAddress();
        if (tokenA == tokenB) revert InvalidToken();
        if (feeBps_ >= 10_000) revert InvalidFee();

        (address _token0, address _token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        token0 = _token0;
        token1 = _token1;
        router = router_;
        feeBps = feeBps_;

        lpToken = new LPToken("MiniDEX LP Token", "mLP", address(this));
    }

    /// @notice Returns the current reserves
    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _timestamp) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _timestamp = blockTimestampLast;
    }

    /// @notice Mints LP tokens for deposited liquidity
    /// @dev Tokens must be transferred to the pool before calling
    function mint(address to) external nonReentrant onlyRouter returns (uint256 liquidity) {
        address token0_ = token0;
        address token1_ = token1;
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        uint256 balance0 = IERC20(token0_).balanceOf(address(this));
        uint256 balance1 = IERC20(token1_).balanceOf(address(this));
        uint256 amount0;
        uint256 amount1;
        unchecked {
            amount0 = balance0 - _reserve0;
            amount1 = balance1 - _reserve1;
        }

        uint256 totalSupply = lpToken.totalSupply();
        if (totalSupply == 0) {
            uint256 rootK = Math.sqrt(amount0 * amount1);
            liquidity = rootK - MINIMUM_LIQUIDITY;
            lpToken.mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            uint256 liquidity0 = (amount0 * totalSupply) / _reserve0;
            uint256 liquidity1 = (amount1 * totalSupply) / _reserve1;
            liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
        }

        if (liquidity == 0) revert InsufficientLiquidityMinted();
        lpToken.mint(to, liquidity);

        _update(balance0, balance1);
        emit Mint(msg.sender, to, amount0, amount1, liquidity);
    }

    /// @notice Burns LP tokens and returns underlying tokens
    /// @dev LP tokens must be transferred to the pool before calling
    function burn(address to) external nonReentrant onlyRouter returns (uint256 amount0, uint256 amount1) {
        address token0_ = token0;
        address token1_ = token1;
        uint256 balance0 = IERC20(token0_).balanceOf(address(this));
        uint256 balance1 = IERC20(token1_).balanceOf(address(this));
        uint256 liquidity = lpToken.balanceOf(address(this));
        uint256 totalSupply = lpToken.totalSupply();

        amount0 = (liquidity * balance0) / totalSupply;
        amount1 = (liquidity * balance1) / totalSupply;
        if (amount0 == 0 || amount1 == 0) revert InsufficientLiquidityBurned();

        lpToken.burn(address(this), liquidity);
        IERC20(token0_).safeTransfer(to, amount0);
        IERC20(token1_).safeTransfer(to, amount1);

        balance0 = IERC20(token0_).balanceOf(address(this));
        balance1 = IERC20(token1_).balanceOf(address(this));
        _update(balance0, balance1);

        emit Burn(msg.sender, to, amount0, amount1, liquidity);
    }

    /// @notice Swaps exact input tokens for output tokens
    /// @param tokenIn The input token
    /// @param to Recipient of output tokens
    /// @param amountOutMin Minimum amount of output tokens
    function swap(address tokenIn, address to, uint256 amountOutMin)
        external
        nonReentrant
        onlyRouter
        returns (uint256 amountOut)
    {
        address token0_ = token0;
        address token1_ = token1;
        if (tokenIn != token0_ && tokenIn != token1_) revert InvalidToken();
        if (to == address(0)) revert ZeroAddress();

        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        bool zeroForOne = tokenIn == token0_;
        (uint256 reserveIn, uint256 reserveOut) = zeroForOne
            ? (uint256(_reserve0), uint256(_reserve1))
            : (uint256(_reserve1), uint256(_reserve0));

        uint256 balance0 = IERC20(token0_).balanceOf(address(this));
        uint256 balance1 = IERC20(token1_).balanceOf(address(this));
        uint256 balanceIn = zeroForOne ? balance0 : balance1;
        uint256 amountIn;
        unchecked {
            amountIn = balanceIn - reserveIn;
        }
        if (amountIn == 0) revert InsufficientInputAmount();

        amountOut = SwapLogic.getAmountOut(amountIn, reserveIn, reserveOut, feeBps);
        if (amountOut < amountOutMin) revert InsufficientOutputAmount();

        address tokenOut = zeroForOne ? token1_ : token0_;
        IERC20(tokenOut).safeTransfer(to, amountOut);

        balance0 = IERC20(token0_).balanceOf(address(this));
        balance1 = IERC20(token1_).balanceOf(address(this));
        _update(balance0, balance1);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, to);
    }

    /// @notice Force reserves to match actual balances
    function sync() external nonReentrant onlyRouter {
        address token0_ = token0;
        address token1_ = token1;
        uint256 balance0 = IERC20(token0_).balanceOf(address(this));
        uint256 balance1 = IERC20(token1_).balanceOf(address(this));
        _update(balance0, balance1);
    }

    function _update(uint256 balance0, uint256 balance1) private {
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = uint32(block.timestamp);
        emit Sync(reserve0, reserve1);
    }
}
