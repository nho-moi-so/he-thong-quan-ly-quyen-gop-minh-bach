// models/Fund.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const fundSchema = new Schema({
  tenNhom: String,
  vaiTro: String,
  logo: [{ filename: String, url: String }],
  linkGioiThieu: String,
  thanhTich: [{ filename: String, url: String }],
  mucDich: [String],
  camKetCongKhai: String,
  tenQuy: String,
  moTaNgan: String,
  gioiThieu: String,
  anhChinh: [{ filename: String, url: String }],
  anhThumbnail: [{ filename: String, url: String }],
  danhMuc: [String],
  soTienMucTieu: Number,
  ngayBatDau: Date,
  ngayKetThuc: Date,
  chuTaiKhoan: String,
  soTaiKhoan: String,
  nganHang: String,
  chiNhanh: String,
  qrCode: [{ filename: String, url: String }],
  nguoiLap: { type: Schema.Types.ObjectId, ref: 'User' },
  donViPhuTrach: String,
  trangThai: String,
  ngayTao: Date,
  soTienHienTai: { type: Number, default: 0 },
  danhSachNguoiUngHo: [
    {
      name: String,
      amount: Number,
      anonymous: Boolean,
      date: Date
    }
  ],
  email: { type: String, default: "" },
  facebook: { type: String, default: "" },
  phone: { type: String, default: "" },
  diaChi: { type: String, default: "" }
}, { collection: 'quy' });

module.exports = mongoose.model('Fund', fundSchema);
