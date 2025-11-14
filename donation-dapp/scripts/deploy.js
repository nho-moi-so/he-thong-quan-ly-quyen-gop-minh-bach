// scripts/deploy.js
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // 1️⃣ Khởi tạo provider với Sepolia RPC URL
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // 2️⃣ Khởi tạo wallet từ private key
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("🔹 Deploying with account:", deployer.address);

  // 3️⃣ Lấy artifact ABI và bytecode từ Hardhat
  const artifactPath = path.resolve(
    "./artifacts/contracts/Donation.sol/Donation.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // 4️⃣ Tạo ContractFactory
  const DonationFactory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    deployer
  );

  // 5️⃣ Deploy contract
  const donationContract = await DonationFactory.deploy();

  // 6️⃣ Chờ deploy hoàn tất
  await donationContract.waitForDeployment();

  console.log(`✅ Donation Contract deployed to: ${donationContract.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
