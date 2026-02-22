const mongoose = require("mongoose");

const preRegisterSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  patientName: { type: String, required: true },
  age: Number,
  problem: String,
  status: { type: String, default: "pending" } // pending / accepted / cancelled
});

module.exports = mongoose.model("PreRegister", preRegisterSchema);