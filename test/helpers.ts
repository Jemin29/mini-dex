import { ethers } from "hardhat";
import { Contract } from "ethers";

export const FEE_BPS = 30;

export type DexFixture = {
  owner: any;
  trader: any;
  lp: any;
  router: Contract;
  pool: Contract;
  lpToken: Contract;
  tokenA: Contract;
  tokenB: Contract;
};

type FixtureOptions = {
  feeRecipient?: string;
  protocolFeeBps?: number;
};

export async function deployDexFixture(options: FixtureOptions = {}): Promise<DexFixture> {
  const [owner, trader, lp] = await ethers.getSigners();
  const feeRecipient = options.feeRecipient || owner.address;
  const protocolFeeBps = options.protocolFeeBps ?? 0;

  const Router = await ethers.getContractFactory("DexRouter");
  const router = await Router.deploy(owner.address, feeRecipient, protocolFeeBps);
  await router.waitForDeployment();

  const Mock = await ethers.getContractFactory("ERC20Mock");
  const tokenA = await Mock.deploy("Mock Token A", "mA");
  const tokenB = await Mock.deploy("Mock Token B", "mB");
  await tokenA.waitForDeployment();
  await tokenB.waitForDeployment();

  const mintAmount = ethers.parseUnits("1000000", 18);
  await tokenA.mint(owner.address, mintAmount);
  await tokenB.mint(owner.address, mintAmount);
  await tokenA.mint(trader.address, mintAmount);
  await tokenB.mint(trader.address, mintAmount);

  await router.createPool(await tokenA.getAddress(), await tokenB.getAddress(), FEE_BPS);
  const poolAddress = await router.getPool(await tokenA.getAddress(), await tokenB.getAddress());
  const pool = await ethers.getContractAt("LiquidityPool", poolAddress);

  const lpTokenAddress = await pool.lpToken();
  const lpToken = await ethers.getContractAt("LPToken", lpTokenAddress);

  return { owner, trader, lp, router, pool, lpToken, tokenA, tokenB };
}

export async function addInitialLiquidity(
  fixture: DexFixture,
  amountA: string,
  amountB: string,
  signer?: any,
  to?: string
) {
  const deadline = await getDeadline();
  const amountADesired = ethers.parseUnits(amountA, 18);
  const amountBDesired = ethers.parseUnits(amountB, 18);
  const actor = signer || fixture.owner;

  await fixture.tokenA.connect(actor).approve(await fixture.router.getAddress(), amountADesired);
  await fixture.tokenB.connect(actor).approve(await fixture.router.getAddress(), amountBDesired);

  await fixture.router.connect(actor).addLiquidity(
    await fixture.tokenA.getAddress(),
    await fixture.tokenB.getAddress(),
    amountADesired,
    amountBDesired,
    0,
    0,
    to || actor.address,
    deadline
  );
}

export async function getDeadline() {
  const block = await ethers.provider.getBlock("latest");
  return (block?.timestamp || 0) + 600;
}

export async function getReserves(pool: Contract) {
  const [reserve0, reserve1] = await pool.getReserves();
  return { reserve0, reserve1 };
}
