import { ethers } from "ethers";

// THAY THẾ bằng địa chỉ SC đã triển khai trên Testnet của bạn
const CONTRACT_ADDRESS = "0xAB9B8753d8551f9f427032a7743a51A57c56bA52"; 

// THAY THẾ bằng ABI JSON của Smart Contract Donation.sol sau khi compile
// Bạn thường có thể tìm thấy file này trong thư mục /artifacts hoặc /build
const CONTRACT_ABI = [
    // Dán các đối tượng ABI của các hàm vào đây
    // Ví dụ:
    {
        "inputs": [
            { "internalType": "uint256", "name": "_campaignId", "type": "uint256" }
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable", // QUAN TRỌNG: Phải là payable
        "type": "function"
    },
    // ... (Thêm các hàm khác như createCampaign, withdraw, v.v.)
];

/**
 * 🛠️ Lấy instance của Smart Contract
 * @returns {ethers.Contract} Đối tượng Contract đã kết nối với Signer
 */
const getDonationContract = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask chưa được cài đặt hoặc không khả dụng.");
    }
    
    // Tạo Provider (kết nối đọc)
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Lấy Signer (kết nối ghi/giao dịch)
    const signer = await provider.getSigner();

    // Tạo Contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    return contract;
};

// --- HÀM HỖ TRỢ ---

/**
 * Lấy địa chỉ ví hiện tại (nếu đã kết nối)
 * @returns {string | null} Địa chỉ ví
 */
export const getCurrentAddress = async () => {
    if (!window.ethereum) return null;
    try {
        // Sử dụng phương thức gốc của MetaMask để lấy tài khoản đã kết nối
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        // Kiểm tra xem có tài khoản nào được kết nối không
        if (accounts.length > 0) {
            // Trả về địa chỉ dưới dạng chuỗi
            return accounts[0]; 
        }
        return null;
    } catch (error) {
        console.error("Lỗi lấy địa chỉ ví:", error);
        return null;
    }
};

/**
 * Lấy tỷ giá ETH/VND từ API bên ngoài
 * LƯU Ý: Đây là ví dụ sử dụng fetch, bạn cần thay bằng API thực tế.
 * @returns {number} Giá trị 1 ETH tính bằng VND
 */
export const getCurrentEthPrice = async () => {
    // THAY THẾ: Bạn cần dùng API từ các dịch vụ như CoinGecko/CoinMarketCap
    // Đây chỉ là một giá trị MOCK để test.
    return 80000000; // Giả sử 1 ETH = 80,000,000 VND
    
    // Ví dụ về cấu trúc gọi API (thực tế sẽ phức tạp hơn):
    /*
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd');
        const data = await response.json();
        return data.ethereum.vnd;
    } catch (error) {
        console.error("Không thể lấy tỷ giá ETH:", error);
        return 0; // Trả về 0 nếu lỗi
    }
    */
};


/**
 * Gửi giao dịch quyên góp (donate)
 * @param {number} campaignId 
 * @param {string} amountETHString 
 * @returns {Promise<ethers.TransactionResponse>} 
 */
export const handleDonation = async (campaignId, amountETHString) => {
    try {
        const contract = await getDonationContract();
        
        // 1. Chuyển đổi ETH string sang Wei BigInt
        const amountWei = ethers.parseEther(amountETHString);
        
        // 2. ÉP KIỂU campaignId sang chuỗi BigInt
        // THÊM: Sử dụng BigInt() để đảm bảo kiểu dữ liệu là BigInt, không phải chuỗi thường
        const campaignIdBigInt = BigInt(campaignId); 
        
        // Nếu contract của bạn chỉ nhận campaignId và không có tham số khác:
        const tx = await contract.donate(
            campaignIdBigInt, // <-- Dùng BigInt để đảm bảo kiểu uint256
            { 
                value: amountWei 
            }
        );
        
        // Nếu contract của bạn nhận campaignId và các tham số khác:
        // Vui lòng kiểm tra ABI và hàm donate của bạn. Ví dụ:
        // const tx = await contract.donate(campaignIdBigInt, tenNguoiQuyenGop, noiDung,... , { value: amountWei });

        const receipt = await tx.wait(); 
        
        console.log("Giao dịch donate hoàn tất:", receipt);
        return receipt;
    } catch (error) {
        console.error("Lỗi trong handleDonation:", error);
        throw error; 
    }
};
export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask not found.");
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
};

