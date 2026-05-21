import { expect } from "chai";
import { ethers } from "hardhat";
import { deployDexFixture, addInitialLiquidity, getDeadline, FEE_BPS } from "./helpers";

describe("DexRouter", function () {
  it("creates pools and prevents duplicates", async () => {
    const { owner, router, tokenA, tokenB } = await deployDexFixture();

    const pool = await router.getPool(await tokenA.getAddress(), await tokenB.getAddress());
    expect(pool).to.properAddress;

    await expect(
      router.createPool(await tokenA.getAddress(), await tokenB.getAddress(), FEE_BPS)
    ).to.be.revertedWithCustomError(router, "PoolExists");

    await expect(
      router.connect(owner).createPool(ethers.ZeroAddress, await tokenB.getAddress(), FEE_BPS)
    ).to.be.revertedWithCustomError(router, "ZeroAddress");
  });

  it("rejects unauthorized pool creation", async () => {
    const { router, tokenA, tokenB, trader } = await deployDexFixture();

    await expect(
      router.connect(trader).createPool(await tokenA.getAddress(), await tokenB.getAddress(), FEE_BPS)
    ).to.be.revertedWithCustomError(router, "OwnableUnauthorizedAccount");
  });

  it("adds and removes liquidity through router", async () => {
    const { router, pool, lpToken, tokenA, tokenB, owner } = await deployDexFixture();
    await addInitialLiquidity({ router, pool, lpToken, tokenA, tokenB, owner } as any, "100", "100", owner);

    const lpBalance = await lpToken.balanceOf(owner.address);
    expect(lpBalance).to.be.gt(0n);

    await lpToken.approve(await router.getAddress(), lpBalance);
    await expect(
      router.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        lpBalance,
        0,
        0,
        owner.address,
        await getDeadline()
      )
    ).to.emit(router, "LiquidityRemoved");
  });

  it("enforces slippage and deadlines", async () => {
    const { router, tokenA, tokenB, owner } = await deployDexFixture();
    await addInitialLiquidity({ router, tokenA, tokenB, owner } as any, "100", "100", owner);

    await expect(
      router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("10", 18),
        ethers.parseUnits("10", 18),
        ethers.parseUnits("20", 18),
        ethers.parseUnits("20", 18),
        owner.address,
        await getDeadline()
      )
    ).to.be.revertedWithCustomError(router, "InsufficientAmount");

    await expect(
      router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("1", 18),
        ethers.parseUnits("1", 18),
        0,
        0,
        owner.address,
        1
      )
    ).to.be.revertedWithCustomError(router, "DeadlineExpired");
  });
});
