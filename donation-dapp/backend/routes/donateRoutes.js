const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Fund = require("../models/Fund");


//Post tạo giao dịch quyên góp
router.post("/", async (req, res) => {
  try {
    const { fundId, name, email, amount, note, anonymous } = req.body;

    const donation = await Donation.create({
      fundId,
      name,
      email,
      amount,
      note,
      anonymous,
    });

    const fund = await Fund.findById(fundId);
    if (!fund) return res.status(404).json({ message: "Fund không tồn tại" });

    fund.soTienHienTai += amount;

// push người ủng hộ mới vào mảng danhSachNguoiUngHo
fund.danhSachNguoiUngHo.push({
  name,
  amount,
  anonymous,
  date: new Date()
});

await fund.save();

    res.json({ message: "Ủng hộ thành công", amount: donation.amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gửi donate thất bại" });
  }
});


//Get danh sách donate theo email người dùng
router.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const donations = await Donation.find({ email }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


//Get sao kê cho từng quỹ
router.get("/statement/:fundId", async (req, res) => {
  try {
    const { fundId } = req.params;

    const donations = await Donation.find({ fundId }).sort({ createdAt: 1 });

    res.json({
      fundId,
      total: donations.length,
      donations
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


//Get nhiều người ủng hộ nhất cho 1 quỹ
router.get("/top/:fundId", async (req, res) => {
  try {
    const { fundId } = req.params;

    const top = await Donation.aggregate([
      { $match: { fundId } },
      {
        $group: {
          _id: "$email",
          totalAmount: { $sum: "$amount" },
          name: { $first: "$name" }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json(top);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


//Get tổng số tiền và số lần quyên góp theo email người dùng
router.get("/total", async (req, res) => {
  try {
    const { email } = req.query;

    const result = await Donation.aggregate([
      { $match: { email } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result[0] || { total: 0, count: 0 });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


//Get danh sách lần quyên góp theo từng quỹ
router.get("/:fundId", async (req, res) => {
  try {
    const donations = await Donation.find({ fundId: req.params.fundId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh sách donate thất bại" });
  }
});


module.exports = router;
