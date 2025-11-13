const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Kết nối MongoDB thành công');
    console.log('Database đang dùng:', mongoose.connection.name);
  })
  .catch((err) => console.error('Lỗi MongoDB:', err));


const userRoutes = require('./routes/userRoutes');
const dangKyRoutes = require('./routes/dangKyLapQuyRoute');
const quyRoutes = require('./routes/quy');
const dangKyLapQuyRoutes = require('./routes/dangKyLapQuyRoute');
const donateRoutes = require('./routes/donateRoutes'); 

app.use('/api/users', userRoutes);
app.use('/api/dangky', dangKyRoutes);
app.use('/api/quy', quyRoutes);
app.use('/api/dang-ky-lap-quy', dangKyLapQuyRoutes);
app.use('/api/donate', donateRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));
