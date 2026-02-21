const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// LOGIN API
app.post("/addhospital", async (req, res) => {
  try {
    await Hospital.findOneAndUpdate(
      { hospital: req.body.hospital },
      req.body,
      { upsert: true, new: true }
    );

    res.json({ message: "Hospital Updated" });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
