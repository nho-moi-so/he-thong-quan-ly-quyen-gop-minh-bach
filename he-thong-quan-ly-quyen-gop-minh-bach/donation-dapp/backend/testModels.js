const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const DangKyLapQuy = require('./models/DangKyLapQuy');
const NguoiLapQuy = require('./models/NguoiLapQuy');
const Quy = require('./models/Quy');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Kết nối MongoDB thành công');
    console.log('Database đang dùng:', mongoose.connection.name);

    // 🔹 Test tạo user
    const user = await User.create({ hoTen: 'Test User', email: 'test@example.com', matKhau: '123456', vaiTro: 'nguoi_quyen_gop' });
    console.log('User tạo thành công:', user);

    // 🔹 Test tạo đơn đăng ký lập quỹ
    const dangKy = await DangKyLapQuy.create({
      userId: user._id,
      hoTen: user.hoTen,
      ngaySinh: new Date('1990-01-01'),
      soDienThoai: '0123456789',
      email: user.email,
      vaiTroCLB: 'CaNhan',
      mucDichSuDung: 'VanDongDongGop',
      camKetCongKhai: 'DongY'
    });
    console.log('Đơn đăng ký lập quỹ tạo thành công:', dangKy);

    mongoose.connection.close();
  })
  .catch(err => console.error(err));
