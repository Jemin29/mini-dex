import { expect } from "chai";
import { ethers } from "hardhat";
import { addInitialLiquidity, deployDexFixture } from "./helpers";

describe("Router pause controls", function () {
  it("blocks swaps and liquidity while paused", async () => {
    const { router, pool, tokenA, tokenB, owner, trader } = await deployDexFixture();

    await addInitialLiquidity({ router, pool, tokenA, tokenB, owner } as any, "200", "200", owner);

    await router.pause();

    await expect(
      router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("1", 18),
        ethers.parseUnits("1", 18),
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWith("Pausable: paused");

    const amountIn = ethers.parseUnits("1", 18);
    await tokenA.connect(trader).approve(await router.getAddress(), amountIn);

    await expect(
      router.connect(trader).swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountIn,
        0,
        trader.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWith("Pausable: paused");
  });

  it("allows actions after unpause", async () => {
    const { router, pool, tokenA, tokenB, owner } = await deployDexFixture();

    await addInitialLiquidity({ router, pool, tokenA, tokenB, owner } as any, "100", "100", owner);

    await router.pause();
    await router.unpause();

    await expect(
      router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("1", 18),
        ethers.parseUnits("1", 18),
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.emit(router, "LiquidityAdded");
  });
});
