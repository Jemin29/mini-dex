import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const Router = await ethers.getContractFactory("DexRouter");
  const router = await Router.deploy(deployer.address, deployer.address, 0);
  await router.waitForDeployment();

  const Mock = await ethers.getContractFactory("ERC20Mock");
  const tokenA = await Mock.deploy("Mock Token A", "mA");
  const tokenB = await Mock.deploy("Mock Token B", "mB");
  await tokenA.waitForDeployment();
  await tokenB.waitForDeployment();

  const mintAmount = ethers.parseUnits("1000000", 18);
  await tokenA.mint(deployer.address, mintAmount);
  await tokenB.mint(deployer.address, mintAmount);

  const feeBps = 30;
  const createTx = await router.createPool(await tokenA.getAddress(), await tokenB.getAddress(), feeBps);
  await createTx.wait();

  console.log("Deployer:", deployer.address);
  console.log("Router:", await router.getAddress());
  console.log("TokenA:", await tokenA.getAddress());
  console.log("TokenB:", await tokenB.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
