import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

const config = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts",  
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      type: "http",  // <-- Thêm dòng này
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};

export default config;
