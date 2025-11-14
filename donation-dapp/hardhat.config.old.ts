import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";

// Lấy Etherscan API Key từ .env (không nhạy cảm)
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export default {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      // DÁN URL RPC TRỰC TIẾP
      url: "https://sepolia.infura.io/v3/1a0e21913b9a4ff4a6386607087263f9",

      // DÁN PRIVATE KEY TRỰC TIẾP (PHẢI LÀ MẢNG)
      accounts: [
        "0xf04df8d1b9643209a0bba4eeff42cf1ec2643822c09b8060b5738b450ff4d5ad",
      ],

      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
