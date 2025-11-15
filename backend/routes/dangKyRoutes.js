const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async (req, res) => {
  try {
    const { hoTen, email, matKhau } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const user = await User.create({ hoTen, email, matKhau, vaiTro: 'nguoi_quyen_gop', ngayDangKy: new Date() });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, matKhau } = req.body;
    const user = await User.findOne({ email, matKhau });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu sai' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
