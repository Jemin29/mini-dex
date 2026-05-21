import { expect } from "chai";
import { ethers } from "hardhat";
import { deployDexFixture, addInitialLiquidity, getReserves } from "./helpers";

describe("Swaps", function () {
  it("executes swaps and updates reserves", async () => {
    const { router, pool, tokenA, tokenB, trader } = await deployDexFixture();
    await addInitialLiquidity({ router, pool, tokenA, tokenB, owner: trader } as any, "300", "300", trader);

    const amountIn = ethers.parseUnits("10", 18);
    await tokenA.connect(trader).approve(await router.getAddress(), amountIn);

    const expectedOut = await router.getAmountOut(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      amountIn
    );

    const { reserve0: before0, reserve1: before1 } = await getReserves(pool);

    await expect(
      router.connect(trader).swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountIn,
        expectedOut - 1n,
        trader.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.emit(pool, "Swap");

    const { reserve0: after0, reserve1: after1 } = await getReserves(pool);
    expect(after0).to.not.equal(before0);
    expect(after1).to.not.equal(before1);
  });

  it("accrues LP rewards via fee growth", async () => {
    const { router, pool, tokenA, tokenB, trader } = await deployDexFixture();
    await addInitialLiquidity({ router, pool, tokenA, tokenB, owner: trader } as any, "500", "500", trader);

    const { reserve0: before0, reserve1: before1 } = await getReserves(pool);
    const kBefore = before0 * before1;

    const amountIn = ethers.parseUnits("20", 18);
    await tokenA.connect(trader).approve(await router.getAddress(), amountIn);
    const expectedOut = await router.getAmountOut(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      amountIn
    );

    await router.connect(trader).swapExactTokensForTokens(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      amountIn,
      expectedOut - 1n,
      trader.address,
      (await ethers.provider.getBlock("latest"))!.timestamp + 1000
    );

    const { reserve0: after0, reserve1: after1 } = await getReserves(pool);
    const kAfter = after0 * after1;
    expect(kAfter).to.be.gt(kBefore);
  });

  it("reverts when slippage is too tight", async () => {
    const { router, tokenA, tokenB, trader, pool } = await deployDexFixture();
    await addInitialLiquidity({ router, tokenA, tokenB, owner: trader } as any, "100", "100", trader);

    const amountIn = ethers.parseUnits("1", 18);
    await tokenA.connect(trader).approve(await router.getAddress(), amountIn);

    await expect(
      router.connect(trader).swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountIn,
        ethers.parseUnits("100", 18),
        trader.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWithCustomError(pool, "InsufficientOutputAmount");
  });
});
