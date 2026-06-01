import { expect } from "chai";
import { ethers } from "hardhat";
import { addInitialLiquidity, deployDexFixture } from "./helpers";

describe("Router protocol fees", function () {
  it("charges protocol fee to recipient", async () => {
    const protocolFeeBps = 100;
    const { router, tokenA, tokenB, pool, owner, trader } = await deployDexFixture({
      protocolFeeBps,
      feeRecipient: owner.address
    });

    await addInitialLiquidity({ router, pool, tokenA, tokenB, owner } as any, "300", "300", owner);

    const amountIn = ethers.parseUnits("10", 18);
    await tokenA.connect(trader).approve(await router.getAddress(), amountIn);

    const feeRecipientBefore = await tokenA.balanceOf(owner.address);
    const poolBefore = await tokenA.balanceOf(await pool.getAddress());

    await router.connect(trader).swapExactTokensForTokens(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      amountIn,
      0,
      trader.address,
      (await ethers.provider.getBlock("latest"))!.timestamp + 1000
    );

    const fee = (amountIn * BigInt(protocolFeeBps)) / 10_000n;
    const feeRecipientAfter = await tokenA.balanceOf(owner.address);
    const poolAfter = await tokenA.balanceOf(await pool.getAddress());

    expect(feeRecipientAfter - feeRecipientBefore).to.equal(fee);
    expect(poolAfter - poolBefore).to.equal(amountIn - fee);
  });

  it("restricts protocol fee updates", async () => {
    const { router, trader } = await deployDexFixture();

    await expect(
      router.connect(trader).setProtocolFeeBps(10)
    ).to.be.revertedWithCustomError(router, "OwnableUnauthorizedAccount");

    await expect(router.setProtocolFeeBps(2000)).to.be.revertedWithCustomError(router, "InvalidFee");
  });

  it("validates fee recipient", async () => {
    const { router } = await deployDexFixture();

    await expect(router.setFeeRecipient(ethers.ZeroAddress)).to.be.revertedWithCustomError(
      router,
      "InvalidRecipient"
    );
  });
});
