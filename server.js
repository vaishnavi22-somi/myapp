const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config(); // ✅ Load MONGO_URI

const app = express();
const port = process.env.PORT || 8080;

// ✅ Use MongoDB Atlas instead of localhost
const url = process.env.MONGO_URI; 
const dbName = "people";

let myDB;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Connect to MongoDB Atlas
MongoClient.connect(url)
  .then((client) => {
    console.log("✅ Connected to MongoDB Atlas");
    myDB = client.db(dbName).collection("friends");
  })
  .catch((err) => console.error("❌ Database connection failed:", err));

// ➕ Add new user
app.post("/users", (req, res) => {
  myDB.insertOne(req.body)
    .then(() => res.json({ message: "User added successfully" }))
    .catch(err => res.status(500).json({ error: err }));
});

// 📋 Get all users
app.get("/users", (req, res) => {
  myDB.find().toArray()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err }));
});

// ✏ Update user by name
app.put("/users", (req, res) => {
  const { oldName, newName } = req.body;
  myDB.updateOne({ name: oldName }, { $set: { name: newName } })
    .then(() => res.json({ message: "User updated successfully" }))
    .catch(err => res.status(500).json({ error: err }));
});

// 🗑 Delete user
app.delete("/users/:name", (req, res) => {
  const name = req.params.name;
  myDB.deleteOne({ name })
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(err => res.status(500).json({ error: err }));
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(port, () => {
  console.log("🚀 Server running at http://localhost:${port}");
});