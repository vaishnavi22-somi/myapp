const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Replace the password below
mongoose.connect("mongodb+srv://srivaishnavi200622_db_user:mydbpass2006@cluster0.hasaklb.mongodb.net/mydatabase")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("MongoDB Atlas Connected ✅");
});

app.listen(3333, () => {
  console.log("🚀 Server running at http://localhost:3000");
});