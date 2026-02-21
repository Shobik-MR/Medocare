const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  beds: Number,
  doctors: Number,
  emergency: String,
  ambulance: String,
});

module.exports = mongoose.model("Hospital", hospitalSchema);