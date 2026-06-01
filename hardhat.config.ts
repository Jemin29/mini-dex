import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-coverage";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const SCAI_TESTNET_RPC_URL = process.env.SCAI_TESTNET_RPC_URL || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const SCAI_EXPLORER_API_KEY = process.env.SCAI_EXPLORER_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    showTimeSpent: true
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    },
    scaiTestnet: {
      url: SCAI_TESTNET_RPC_URL,
      chainId: 7000,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      scaiTestnet: SCAI_EXPLORER_API_KEY
    },
    customChains: [
      {
        network: "scaiTestnet",
        chainId: 7000,
        urls: {
          apiURL: "https://explorer-testnet.scai.network/api",
          browserURL: "https://explorer-testnet.scai.network"
        }
      }
    ]
  }
};

export default config;
