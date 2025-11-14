const mongoose = require('mongoose');

const quySchema = new mongoose.Schema({
  tenQuy: { type: String, required: true },
  moTaNgan: String,             // trước là moTa
  mucTieu: Number,
  soTienHienTai: { type: Number, default: 0 },
  ngayBatDau: Date,
  ngayKetThuc: Date,
  nguoiLapQuy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // trỏ trực tiếp đến User
  trangThai: { type: String, enum: ["DangMo","DaKetThuc","ThanhCong","ThatBai"], default: "DangMo" },
  daThongBao: { type: Boolean, default: false },
  anhChinh: String,             // thêm
  anhChiTiet: [String],         // thêm
  danhMuc: [{ type: String, enum: ["ThienTai","GiaoDuc","MoiTruong","TreEm","XoaNgheo","NguoiCaoTuoi","NguoiKhuyetTat","DanTocThieuSo","Khac"] }],
});

module.exports = mongoose.model('Quy', quySchema);
