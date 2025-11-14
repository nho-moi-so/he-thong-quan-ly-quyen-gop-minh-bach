// scripts/fund.js (Fix Provider bằng cách dùng RPC thủ công)

import hre from "hardhat"; 
// Import các class cần thiết trực tiếp từ gói 'ethers'
import { Wallet, parseEther, JsonRpcProvider } from "ethers"; // <-- Thêm JsonRpcProvider

// CHỈNH SỬA CÁC GIÁ TRỊ NÀY
const RECEIVER_ADDRESS = "0xAB9B8753d8551f9f427032a7743a51A57c56bA52"; 
const AMOUNT_TO_SEND = "0.1"; 
const RPC_URL = "http://127.0.0.1:8545"; // <-- Địa chỉ Node Hardhat đang chạy

async function main() {
    // Lấy Private Key của Account #0 từ terminal 1 (PHẢI DÁN CHÍNH XÁC)
    const nodePrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 
    
    // Khởi tạo Provider thủ công bằng địa chỉ RPC
    // KHẮC PHỤC LỖI: Cannot read properties of undefined (reading 'provider')
    const provider = new JsonRpcProvider(RPC_URL); 

    // Khởi tạo Signer sử dụng Private Key và Provider
    const signer = new Wallet(nodePrivateKey, provider); 

    // Chuyển đổi ETH sang Wei
    const amountWei = parseEther(AMOUNT_TO_SEND);

    console.log(`🔹 Sending ${AMOUNT_TO_SEND} ETH from Hardhat Node to ${RECEIVER_ADDRESS}...`);
    
    // Tạo và gửi giao dịch
    const tx = await signer.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: amountWei,
    });

    await tx.wait();

    console.log(`✅ Transaction successful! Hash: ${tx.hash}`);
    console.log(`Balance of ${RECEIVER_ADDRESS} should now be funded.`);
}

main().catch((error) => {
    console.error("❌ Funding failed:", error);
    process.exitCode = 1;
});