import { expect } from "chai";
import { deployDexFixture } from "./helpers";

describe("ERC20Mock", function () {
  it("allows owner to mint", async () => {
    const { tokenA, owner } = await deployDexFixture();
    await tokenA.mint(owner.address, 123);
    const balance = await tokenA.balanceOf(owner.address);
    expect(balance).to.be.gt(0n);
  });

  it("prevents non-owner minting", async () => {
    const { tokenA, trader } = await deployDexFixture();
    await expect(tokenA.connect(trader).mint(trader.address, 1)).to.be.revertedWithCustomError(
      tokenA,
      "OwnableUnauthorizedAccount"
    );
  });
});
