// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title LPToken
/// @notice ERC20 token representing liquidity provider shares
contract LPToken is ERC20 {
    error NotPool();

    address public immutable pool;

    constructor(string memory name_, string memory symbol_, address pool_) ERC20(name_, symbol_) {
        if (pool_ == address(0)) revert NotPool();
        pool = pool_;
    }

    /// @notice Mints LP tokens to a recipient
    /// @dev Only callable by the pool
    function mint(address to, uint256 amount) external {
        if (msg.sender != pool) revert NotPool();
        _mint(to, amount);
    }

    /// @notice Burns LP tokens from a holder
    /// @dev Only callable by the pool
    function burn(address from, uint256 amount) external {
        if (msg.sender != pool) revert NotPool();
        _burn(from, amount);
    }
}
