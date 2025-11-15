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
const dangKyRoutes = require('./routes/dangKyRoutes');               
const dangKyLapQuyRoutes = require('./routes/dangKyLapQuyRoute'); //Này bị sai nhưng tạm thời để vậy đã//
const donationRoutes = require("./routes/donateRoutes");
const fundRoutes = require('./routes/fundRoutes');


app.use('/api/users', userRoutes);
app.use('/api/dangky', dangKyRoutes);
app.use('/api/dang-ky-lap-quy', dangKyLapQuyRoutes);//Này sai do ở trên cũng sai//
app.use("/api/donate", donateRoutes);
app.use('/api/funds', fundRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));
