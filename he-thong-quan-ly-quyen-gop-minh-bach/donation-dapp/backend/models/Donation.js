

//phần tạo quỹ chưa tạo được nên phần này cũng k sài được luôn//
const mongoose = require("mongoose");

const donateSchema = new mongoose.Schema(
  {
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true }, // quỹ nhận tiền
    name: { type: String, required: function() { return !this.anonymous } },
    email: { type: String, required: function() { return !this.anonymous } },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    anonymous: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Donate", donateSchema);
