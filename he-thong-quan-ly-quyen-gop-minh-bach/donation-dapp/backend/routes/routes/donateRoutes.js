const express = require("express");
const router = express.Router();
const Donate = require("../models/Donate");

// POST: tạo ủng hộ
router.post("/", async (req, res) => {
  try {
    const { fundId, name, email, amount, note, anonymous } = req.body;

    if (!fundId || !amount) {
      return res.status(400).json({ message: "Thiếu fundId hoặc amount" });
    }

    const donate = new Donate({
      fundId,
      name,
      email,
      amount,
      note,
      anonymous,
    });

    await donate.save();
    res.status(201).json(donate);
  } catch (err) {
    console.error("Lỗi tạo donate:", err);
    res.status(500).json({ message: "Tạo donate thất bại", error: err.message });
  }
});

// GET: lấy danh sách donate của 1 quỹ
router.get("/:fundId", async (req, res) => {
  try {
    const { fundId } = req.params;
    const donations = await Donate.find({ fundId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error("Lỗi lấy donate:", err);
    res.status(500).json({ message: "Lấy donate thất bại", error: err.message });
  }
});

module.exports = router;
