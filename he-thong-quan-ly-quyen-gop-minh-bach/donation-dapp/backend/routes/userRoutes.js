const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Đăng ký user mới
router.post('/', async (req, res) => {
  try {
    const { hoTen, email, matKhau } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng!' });
    }

    const user = new User({
      hoTen,
      email,
      matKhau,
      dienThoai: "",
      vaiTro: "CaNhan", 
      tenNhom: "",
      diaChi: "",
      social: "",
      logo: [],
      linkGioiThieu: "",
      thanhTich: [],
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      hoTen: user.hoTen,
      email: user.email,
    });
  } catch (err) {
    console.error("Lỗi khi tạo user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại!' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật thông tin user
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body; // hoTen, email, dienThoai, diaChi, etc.

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User không tồn tại!' });

    res.json({
      message: 'Cập nhật thành công!',
      user,
    });
  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    res.status(500).json({ error: err.message });
  }
});

//  Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, matKhau } = req.body;

    const user = await User.findOne({ email, matKhau });
    if (!user) return res.status(401).json({ error: 'Sai email hoặc mật khẩu!' });

    res.json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        vaiTro: user.vaiTro,
        tenNhom: user.tenNhom,
        diaChi: user.diaChi,
        social: user.social,
        logo: user.logo,
        linkGioiThieu: user.linkGioiThieu,
        thanhTich: user.thanhTich,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
