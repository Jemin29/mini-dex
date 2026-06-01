import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const feeRecipient = process.env.FEE_RECIPIENT || deployer.address;
  const protocolFeeBps = Number(process.env.PROTOCOL_FEE_BPS || "0");

  const Router = await ethers.getContractFactory("DexRouter");
  const router = await Router.deploy(deployer.address, feeRecipient, protocolFeeBps);
  await router.waitForDeployment();

  const tokenA = process.env.TOKEN_A_ADDRESS || "";
  const tokenB = process.env.TOKEN_B_ADDRESS || "";
  const poolFeeBps = Number(process.env.POOL_FEE_BPS || "30");

  if (tokenA && tokenB) {
    const tx = await router.createPool(tokenA, tokenB, poolFeeBps);
    await tx.wait();
  }

  console.log("Deployer:", deployer.address);
  console.log("Router:", await router.getAddress());
  console.log("Fee recipient:", feeRecipient);
  console.log("Protocol fee bps:", protocolFeeBps);

  if (tokenA && tokenB) {
    const pool = await router.getPool(tokenA, tokenB);
    console.log("Pool:", pool);
  } else {
    console.log("Pool: skipped (TOKEN_A_ADDRESS/TOKEN_B_ADDRESS not set)");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
