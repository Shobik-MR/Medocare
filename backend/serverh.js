

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Hospital = require("./hospital");
const Admin = require("./Admin");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "medocarekey";

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));


// ================== APIs ==================


// ================= ADMIN AUTH =================

// ✅ SIGNUP
app.post("/api/admin/signup", async (req, res) => {

  const { hospitalName, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    hospitalName,
    email,
    password: hashed,
  });

  await Hospital.create({
  hospitalName,
});
const token = jwt.sign(
  {
    id: admin._id,
    hospitalName: admin.hospitalName
  },
  SECRET,
  { expiresIn: "1d" }
);

  res.json({
    success: true,
    hospitalName: admin.hospitalName,
    token
  });
});


// ✅ LOGIN
app.post("/api/admin/login", async (req, res) => {

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) return res.json({ success: false });

  const match = await bcrypt.compare(password, admin.password);

  if (!match) return res.json({ success: false });

  const token = jwt.sign(
    { hospitalName: admin.hospitalName },
    SECRET
  );

  res.json({
    success: true,
    token,
    hospitalName: admin.hospitalName,
  });
});

app.get("/myhospital", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json("No token");

  const decoded = jwt.verify(token, SECRET);

  const hospital = await Hospital.findOne({
    hospitalName: decoded.hospitalName,
  });

  res.json(hospital);
});



// ================= HOSPITAL =================

// ✅ ADD / UPDATE hospital
app.post("/addhospital", async (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json("No token");

  const decoded = jwt.verify(token, SECRET);

  const updated = await Hospital.findOneAndUpdate(
    { hospitalName: decoded.hospitalName },
    req.body,
    { new: true, upsert: true }
  );

  res.json(updated);
});
// ✅ GET hospitals
app.get("/gethospital/:name", async (req, res) => {
  const data = await Hospital.findOne({ hospitalName: req.params.name });
  res.json(data);
});

// ✅ GET ALL hospitals for Dashboard
app.get("/gethospitals", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});



app.listen(5000, () => console.log("🚀 Server running on port 5000"));