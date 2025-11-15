const mongoose = require("mongoose");
//Đang chưa biết nên cho tự điền tên hay lấy luôn tên khi tạo User//
const donationSchema = new mongoose.Schema({
  fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  amount: { type: Number, required: true },
  note: { type: String, default: "" },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
