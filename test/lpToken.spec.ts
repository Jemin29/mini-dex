import { expect } from "chai";
import { deployDexFixture } from "./helpers";

describe("LPToken", function () {
  it("restricts mint and burn to the pool", async () => {
    const { lpToken, trader } = await deployDexFixture();

    await expect(
      lpToken.connect(trader).mint(trader.address, 1)
    ).to.be.revertedWithCustomError(lpToken, "NotPool");

    await expect(
      lpToken.connect(trader).burn(trader.address, 1)
    ).to.be.revertedWithCustomError(lpToken, "NotPool");
  });
});
