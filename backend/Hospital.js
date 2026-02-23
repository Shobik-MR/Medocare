const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  beds: Number,
  doctors: Number,
  emergency: String,
  ambulance: String,
   location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model("Hospital", hospitalSchema);