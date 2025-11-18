const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');

// Lấy tất cả quỹ
router.get('/', async (req, res) => {
  try {
    const funds = await Fund.find();
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Lấy chi tiết quỹ theo id, kèm thông tin người lập quỹ
router.get('/:id', async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id).populate('creatorId', 'hoTen email');
    if (!fund) return res.status(404).json({ message: 'Không tìm thấy quỹ' });

    const fundData = fund.toObject();

    // Thêm thông tin creator trực tiếp vào object
    if (fund.creatorId) {
      fundData.creator = {
        hoTen: fund.creatorId.hoTen,
        email: fund.creatorId.email
      };
    }

    res.json(fundData);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
