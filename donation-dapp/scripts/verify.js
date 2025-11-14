import axios from "axios";
import fs from "fs";
import "dotenv/config";

// Thay bằng địa chỉ contract vừa deploy
const CONTRACT_ADDRESS = "0xf7210cc528341c88ba13d3DeE4bcefBf6375E2F2";

// Đường dẫn đến file contract
const CONTRACT_FILE = "./contracts/Donation.sol";

// Compiler version tương ứng Hardhat config
const COMPILER_VERSION = "v0.8.28+commit.6a57276f";

const API_KEY = process.env.ETHERSCAN_API_KEY;

async function main() {
  if (!API_KEY) {
    console.error("Vui lòng thêm ETHERSCAN_API_KEY vào file .env");
    process.exit(1);
  }

  // Đọc source code
  const sourceCode = fs.readFileSync(CONTRACT_FILE, "utf8");

  const params = new URLSearchParams();
  params.append("apikey", API_KEY);
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", CONTRACT_ADDRESS);
  params.append("sourceCode", sourceCode);
  params.append("codeformat", "solidity-single-file");
  params.append("contractname", "Donation"); // Tên contract
  params.append("compilerversion", COMPILER_VERSION);
  params.append("optimizationUsed", "0"); // 0 = không tối ưu, 1 = tối ưu
  params.append("runs", "200");
  params.append("licenseType", "3"); // MIT

  try {
    const response = await axios.post("https://api-sepolia.etherscan.io/api", params);
    console.log("Etherscan response:", response.data);
    if (response.data.status === "1") {
      console.log("Verify thành công! GUID:", response.data.result);
    } else {
      console.error("Verify thất bại:", response.data.result);
    }
  } catch (err) {
    console.error("Lỗi khi verify:", err.message);
  }
}

main();
