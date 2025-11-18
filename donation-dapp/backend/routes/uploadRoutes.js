

const multer = require('multer');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route: Cập nhật ảnh bìa
router.post('/:id/cover', upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không có file!' });

    const coverUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { cover: coverUrl },
      { new: true }
    );

    res.json({ cover: coverUrl, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Cập nhật avatar
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không có file!' });

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { logo: avatarUrl } }, // thêm vào mảng logo
      { new: true }
    );

    res.json({ avatar: avatarUrl, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});