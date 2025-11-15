//Này là lúc đầu t tính tạo 1 model riêng cho việc đăng ký lập quỹ nhưng thực ra sao đó mới biết là cần 2 collection//
const mongoose = require('mongoose');
const { formatWithOptions } = require('util');

const dangKyLapQuySchema = new mongoose.Schema({
  // ---- THÔNG TIN CÁ NHÂN / TỔ CHỨC ----
  hoTen: { type: String, required: true },
  ngaySinh: { type: Date },
  dienThoai: { type: String, required: true },
  email: { type: String, required: true },
  social: { type: String },
  diaChi: { type: String },
  tenNhom: { type: String },
  vaiTro: { type: String },
  logo: [{ type: Object }],
  linkGioiThieu: { type: String },
  thanhTich: [{ type: Object }],

  // ---- THÔNG TIN QUỸ ----
  mucDich: [{ type: String }],
  camKetCongKhai: { type: String },
  tenQuy: { type: String },
  moTaNgan: { type: String },
  gioiThieu: { type: String },
  anhChinh: [{ type: Object }],
  anhThumbnail: [{ type: Object }],
  danhMuc: [{ type: String }],
  soTienMucTieu: { type: Number },
  ngayBatDau: { type: Date },
  ngayKetThuc: { type: Date },

  // ---- THÔNG TIN NGÂN HÀNG ----
  chuTaiKhoan: { type: String },
  soTaiKhoan: { type: String },
  nganHang: { type: String },
  chiNhanh: { type: String },
  qrCode: [{ type: Object }],

  // ---- QUẢN LÝ HỆ THỐNG ----
  nguoiLap: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  donViPhuTrach: { type: String }, // nếu muốn thêm mới
  trangThai: { type: String, default: 'ChoDuyet' },
  ngayTao: { type: Date, default: Date.now },

}, { strict: false }); // cho phép thêm trường mới linh hoạt

module.exports = mongoose.model('DangKyLapQuy', dangKyLapQuySchema);
formatWithOptions 