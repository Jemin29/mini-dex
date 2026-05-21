import { expect } from "chai";
import { ethers } from "hardhat";
import { deployDexFixture, addInitialLiquidity, getReserves } from "./helpers";

describe("LiquidityPool", function () {
  it("mints and updates reserves", async () => {
    const { pool, tokenA, tokenB, owner } = await deployDexFixture();
    await addInitialLiquidity({ pool, tokenA, tokenB, owner } as any, "250", "250", owner);

    const { reserve0, reserve1 } = await getReserves(pool);
    expect(reserve0).to.be.gt(0n);
    expect(reserve1).to.be.gt(0n);
  });

  it("prevents non-router access", async () => {
    const { pool, trader } = await deployDexFixture();

    await expect(
      pool.connect(trader).sync()
    ).to.be.revertedWithCustomError(pool, "NotRouter");
  });

  it("burns liquidity and returns tokens", async () => {
    const { pool, router, lpToken, tokenA, tokenB, owner } = await deployDexFixture();
    await addInitialLiquidity({ pool, router, lpToken, tokenA, tokenB, owner } as any, "150", "150", owner);

    const lpBalance = await lpToken.balanceOf(owner.address);
    await lpToken.approve(await router.getAddress(), lpBalance);

    await expect(
      router.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        lpBalance,
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.emit(pool, "Burn");
  });

  it("reverts on invalid swap inputs", async () => {
    const { pool, tokenA, tokenB, owner, router } = await deployDexFixture();
    await addInitialLiquidity({ pool, tokenA, tokenB, owner, router } as any, "100", "100", owner);

    await expect(
      pool.swap(await tokenA.getAddress(), owner.address, 0)
    ).to.be.revertedWithCustomError(pool, "NotRouter");

    await expect(
      router.swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("1", 18),
        ethers.parseUnits("100", 18),
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.reverted;
  });
});
