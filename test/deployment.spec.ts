import { expect } from "chai";
import { deployDexFixture } from "./helpers";

describe("Deployment validation", function () {
  it("deploys router and pool with expected configuration", async () => {
    const { router, pool, lpToken, owner } = await deployDexFixture();

    expect(await router.owner()).to.equal(owner.address);
    expect(await router.feeRecipient()).to.equal(owner.address);
    expect(await router.protocolFeeBps()).to.equal(0);

    expect(await pool.router()).to.equal(await router.getAddress());
    expect(await pool.lpToken()).to.equal(await lpToken.getAddress());
  });
});
