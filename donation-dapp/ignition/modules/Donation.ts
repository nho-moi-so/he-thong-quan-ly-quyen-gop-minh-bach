import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as m from "@nomicfoundation/hardhat-ignition/modules";

// Module triển khai hợp đồng Donation
export default buildModule("DonationModule", (m) => {
    // 1. Triển khai hợp đồng Donation
    // Hợp đồng Donation.sol không có constructor arguments (tham số đầu vào)
    const donation = m.contract("Donation");

    // 2. (Tùy chọn) Gọi một hàm sau khi triển khai
    // Nếu bạn có một hàm khởi tạo (initializer) hoặc cần gọi bất kỳ hàm nào ngay lập tức, bạn có thể thêm:
    // Ví dụ: m.call(donation, "initialize", [initialValue]);

    // Trả về đối tượng contract để sử dụng trong các module khác nếu cần
    return { donation };
});