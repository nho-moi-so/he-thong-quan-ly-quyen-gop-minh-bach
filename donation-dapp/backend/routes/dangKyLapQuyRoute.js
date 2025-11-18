const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const DangKyLapQuy = require("../models/DangKyLapQuy");
const Quy = require("../models/Fund");
const User = require("../models/User");

// === MULTER CONFIG ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    return extOk && mimeOk ? cb(null, true) : cb(new Error("File không hợp lệ"));
  },
});

const cpUpload = upload.fields([
  { name: "logo", maxCount: 5 },
  { name: "thanhTich", maxCount: 10 },
  { name: "anhChinh", maxCount: 1 },
  { name: "anhThumbnail", maxCount: 10 },
  { name: "qrCode", maxCount: 1 },
]);

// === ROUTE ===
router.post("/", cpUpload, async (req, res) => {
  try {
    const { nguoiLap } = req.body;
    if (!nguoiLap) return res.status(400).json({ message: "Thiếu ID người lập" });

    // Helper
    const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const toDate = (v) => (v ? new Date(v) : null);
    const toNum = (v) => (v ? parseInt(v, 10) : null);
    const getFiles = (field) =>
      req.files?.[field]?.map((f) => ({
        name: f.originalname,
        url: `/uploads/${f.filename}`,
        path: f.path,
      })) || [];

    // 1. Lưu đơn đăng ký (audit)
    const don = await DangKyLapQuy.create({
      hoTen: req.body.hoTen,
      dienThoai: req.body.dienThoai,
      email: req.body.email,
      ngaySinh: toDate(req.body.ngaySinh),
      social: req.body.social,
      diaChi: req.body.diaChi,
      tenNhom: req.body.tenNhom,
      vaiTro: req.body.vaiTro,
      logo: getFiles("logo"),
      linkGioiThieu: req.body.linkGioiThieu,
      thanhTich: getFiles("thanhTich"),
      mucDich: toArray(req.body.mucDich),
      camKetCongKhai: req.body.camKetCongKhai,
      tenQuy: req.body.tenQuy,
      moTaNgan: req.body.moTaNgan,
      gioiThieu: req.body.gioiThieu,
      anhChinh: getFiles("anhChinh"),
      anhThumbnail: getFiles("anhThumbnail"),
      danhMuc: toArray(req.body.danhMuc),
      soTienMucTieu: toNum(req.body.soTienMucTieu),
      ngayBatDau: toDate(req.body.ngayBatDau),
      ngayKetThuc: toDate(req.body.ngayKetThuc),
      chuTaiKhoan: req.body.chuTaiKhoan,
      soTaiKhoan: req.body.soTaiKhoan,
      nganHang: req.body.nganHang,
      chiNhanh: req.body.chiNhanh,
      qrCode: getFiles("qrCode"),
      nguoiLap,
      trangThai: "DaTaoQuy", // mới: đánh dấu đã tạo quỹ
      ngayDangKy: new Date(),
    });

    // 2. Tạo quỹ thật
    const quy = await Quy.create({
      tenQuy: req.body.tenQuy,
      moTaNgan: req.body.moTaNgan,
      mucTieu: toNum(req.body.soTienMucTieu),
      ngayBatDau: toDate(req.body.ngayBatDau),
      ngayKetThuc: toDate(req.body.ngayKetThuc),
      nguoiLapQuy: nguoiLap,
      danhMuc: toArray(req.body.danhMuc),
      anhChinh: getFiles("anhChinh")[0]?.url || null,
      anhChiTiet: getFiles("anhThumbnail").map((f) => f.url),
      // thêm các trường ngân hàng nếu cần
      thongTinNganHang: {
        chuTaiKhoan: req.body.chuTaiKhoan,
        soTaiKhoan: req.body.soTaiKhoan,
        nganHang: req.body.nganHang,
        chiNhanh: req.body.chiNhanh,
        qrCode: getFiles("qrCode")[0]?.url || null,
      },
    });

    // 3. Cập nhật User
    await User.findByIdAndUpdate(
      nguoiLap,
      { $push: { cacQuyDaLap: quy._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Tạo quỹ thành công",
      donDangKy: don,
      quy: quy,
    });
  } catch (err) {
    console.error("Lỗi tạo quỹ:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;