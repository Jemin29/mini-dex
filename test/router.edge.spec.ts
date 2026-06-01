import { expect } from "chai";
import { ethers } from "hardhat";
import { deployDexFixture } from "./helpers";

describe("Router edge cases", function () {
  it("reverts on zero amounts", async () => {
    const { router, tokenA, tokenB, owner } = await deployDexFixture();

    await expect(
      router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        0,
        ethers.parseUnits("1", 18),
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWithCustomError(router, "ZeroAmount");

    await expect(
      router.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        0,
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWithCustomError(router, "ZeroAmount");

    await expect(
      router.swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        0,
        0,
        owner.address,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWithCustomError(router, "ZeroAmount");
  });

  it("reverts on zero recipient", async () => {
    const { router, tokenA, tokenB } = await deployDexFixture();

    await expect(
      router.swapExactTokensForTokens(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseUnits("1", 18),
        0,
        ethers.ZeroAddress,
        (await ethers.provider.getBlock("latest"))!.timestamp + 1000
      )
    ).to.be.revertedWithCustomError(router, "ZeroAddress");
  });
});
