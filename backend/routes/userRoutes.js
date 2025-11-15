const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Đăng ký
router.post('/', async (req, res) => {
  try {
    const { hoTen, email, matKhau } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email đã tồn tại!" });
    }

    const user = await User.create({
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
      gioiTinh: "Nam", // thêm mặc định
    });

    res.status(201).json({
      id: user._id,
      hoTen: user.hoTen,
      email: user.email,
      gioiTinh: user.gioiTinh
    });

  } catch (err) {
    console.error("Lỗi khi tạo user:", err);
    res.status(500).json({ error: err.message });
  }
});

//Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, matKhau } = req.body;

    const user = await User.findOne({ email, matKhau });
    if (!user)
      return res.status(401).json({ error: "Sai email hoặc mật khẩu!" });

    res.json({
      message: "Đăng nhập thành công!",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Lấy thông tin user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "Không tìm thấy user!" });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Cập nhật thông tin user
router.put('/:id', async (req, res) => {
  try {
    // Danh sách các field được phép cập nhật
    const allowedFields = [
      'hoTen',
      'dienThoai',
      'diaChi',
      'bio',
      'gioiTinh'
    ];

    // Lọc chỉ lấy các field hợp lệ từ req.body
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updates[field] = req.body[field];
      }
    });

    // Kiểm tra có dữ liệu để cập nhật không
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Không có dữ liệu để cập nhật!" });
    }

    // Cập nhật với validation
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { 
        new: true, 
        runValidators: true,  // BẮT BUỘC: kiểm tra enum, required, v.v.
        context: 'query' 
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    res.json({
      message: "Cập nhật thành công!",
      user: updated
    });

  } catch (err) {
    console.error("Lỗi cập nhật user:", err);

    // Nếu lỗi validation (ví dụ: gioiTinh không hợp lệ)
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: err.message });
  }
});

module.exports = router;