const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const DangKyLapQuy = require("../models/DangKyLapQuy");

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // thư mục lưu file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Chỉ cho phép ảnh và tài liệu PDF/Word"));
  },
});

// Nhận nhiều loại file cùng lúc
const cpUpload = upload.fields([
  { name: "logo", maxCount: 5 },
  { name: "thanhTich", maxCount: 10 },
  { name: "anhChinh", maxCount: 1 },
  { name: "anhThumbnail", maxCount: 10 },
  { name: "qrCode", maxCount: 1 },
]);

router.post("/", cpUpload, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.nguoiLap) {
      return res.status(400).json({ message: "Thiếu thông tin người lập quỹ" });
    }

    // Chuyển các trường checkbox/multiple thành mảng nếu gửi dạng chuỗi
    const parseArrayField = (field) => {
      if (!formData[field]) return [];
      if (typeof formData[field] === "string") return [formData[field]];
      return Array.isArray(formData[field]) ? formData[field] : [];
    };

    // Parse ngày tháng về Date
    const parseDateField = (field) => {
      if (!formData[field]) return null;
      return new Date(formData[field]);
    };

    // Parse số tiền
    const parseNumberField = (field) => {
      if (!formData[field]) return null;
      return parseInt(formData[field]);
    };

    // Gán đường dẫn file đã upload
    const getFilePaths = (field) => {
      return req.files?.[field]?.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        path: file.path,
      })) || [];
    };

    const newForm = {
      hoTen: formData.hoTen,
      dienThoai: formData.dienThoai,
      email: formData.email,
      ngaySinh: parseDateField("ngaySinh"),
      social: formData.social,
      diaChi: formData.diaChi,
      tenNhom: formData.tenNhom,
      vaiTro: formData.vaiTro,
      logo: getFilePaths("logo"),
      linkGioiThieu: formData.linkGioiThieu,
      thanhTich: getFilePaths("thanhTich"),
      mucDich: parseArrayField("mucDich"),
      camKetCongKhai: formData.camKetCongKhai,
      tenQuy: formData.tenQuy,
      moTaNgan: formData.moTaNgan,
      gioiThieu: formData.gioiThieu,
      anhChinh: getFilePaths("anhChinh"),
      anhThumbnail: getFilePaths("anhThumbnail"),
      danhMuc: parseArrayField("danhMuc"),
      soTienMucTieu: parseNumberField("soTienMucTieu"),
      ngayBatDau: parseDateField("ngayBatDau"),
      ngayKetThuc: parseDateField("ngayKetThuc"),
      chuTaiKhoan: formData.chuTaiKhoan,
      soTaiKhoan: formData.soTaiKhoan,
      nganHang: formData.nganHang,
      chiNhanh: formData.chiNhanh,
      qrCode: getFilePaths("qrCode"),
      nguoiLap: formData.nguoiLap,
      trangThai: "ChoDuyet",
      ngayDangKy: new Date(),
    };

    const saved = await DangKyLapQuy.create(newForm);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Lỗi tạo đơn:", err);
    res.status(500).json({ message: err.message || "Lỗi server" });
  }
});

module.exports = router;
