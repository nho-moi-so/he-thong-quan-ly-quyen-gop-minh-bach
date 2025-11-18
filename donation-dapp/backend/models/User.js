const mongoose = require('mongoose');
//Phần này là t có hỏi bữa là t gộp User với người lập quỹ vô trong có ổn không? Mà không ai trả lời gì nên t thử làm luôn//
//Hiện tại thì đăng nhập, đăng kí là được nhưng tạo quỹ không được//
// userSchema
const userSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  dienThoai: { type: String, default: "" },
  vaiTro: { type: String, enum: ["NguoiSangLap", "ChuNhiem", "CaNhan"], default: "CaNhan" },
  tenNhom: String,
  diaChi: String,
  social: String,
  logo: [String],
  linkGioiThieu: String,
  thanhTich: [String],
  cacQuyDaLap: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quy" }],
  bio: String, // nếu bạn muốn dùng bio riêng
  gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Nam" }, // <- thống nhất với Compass
});


module.exports = mongoose.model('User', userSchema);
