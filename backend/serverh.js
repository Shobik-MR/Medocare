require('dotenv').config();
console.log("KEY:", process.env.GROQ_API_KEY);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Groq = require("groq-sdk");

const Hospital = require("./Hospital");
const Admin = require("./Admin");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "medocarekey";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ================= DATABASE =================

mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));


// ================= ADMIN AUTH =================

app.post("/api/admin/signup", async (req, res) => {
  try {
    const { hospitalName, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ hospitalName, email, password: hashed });
    await Hospital.create({ hospitalName });

    const token = jwt.sign({ id: admin._id, hospitalName: admin.hospitalName }, SECRET, { expiresIn: "1d" });
    res.json({ success: true, hospitalName: admin.hospitalName, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.json({ success: false });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false });

    const token = jwt.sign({ id: admin._id, hospitalName: admin.hospitalName }, SECRET, { expiresIn: "1d" });
    res.json({ success: true, token, hospitalName: admin.hospitalName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET MY HOSPITAL =================

app.get("/myhospital", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("No token");
    const decoded = jwt.verify(token, SECRET);
    const hospital = await Hospital.findOne({ hospitalName: decoded.hospitalName });
    res.json(hospital);
  } catch (error) {
    res.status(401).json("Invalid token");
  }
});


// ================= HOSPITAL =================

app.post("/addhospital", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("No token");
    const decoded = jwt.verify(token, SECRET);
    const updated = await Hospital.findOneAndUpdate(
      { hospitalName: decoded.hospitalName },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(401).json("Invalid token");
  }
});

app.get("/gethospital/:name", async (req, res) => {
  const data = await Hospital.findOne({ hospitalName: req.params.name });
  res.json(data);
});

app.get("/gethospitals", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});


// ================= PRE-REGISTER =================

const PreRegister = require("./PreRegister");

app.post("/preregister", async (req, res) => {
  try {
    const preReg = await PreRegister.create(req.body);
    res.json({ success: true, message: "Pre-registration sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/prehospital/:hospitalName", async (req, res) => {
  const hospitalName = req.params.hospitalName;
  const patients = await PreRegister.find({ hospitalName });
  res.json(patients);
});

app.patch("/prehospital/:id", async (req, res) => {
  const { status } = req.body;
  const updated = await PreRegister.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
});


// ================= CHATBOT =================

app.post("/api/chat", async (req, res) => {
  const { messages, patientName, age, problem, hospitalName } = req.body;

  const systemPrompt = `You are MedoBot, an emergency first aid assistant for MedoCare Healthcare.
Patient details:
- Name: ${patientName}
- Age: ${age}
- Problem: ${problem}
- Pre-registered at: ${hospitalName} (help is already on the way)

Rules:
- Be calm and reassuring
- Give numbered step-by-step first aid instructions
- Always remind to call 108 for life-threatening situations
- Use the patient's name when responding
- Keep responses short and easy to follow under stress`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 512,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ reply: "⚠️ AI unavailable. Call 108 immediately!" });
  }
});


// ================= SERVER =================

app.listen(5000, () => console.log("🚀 Server running on port 5000"));