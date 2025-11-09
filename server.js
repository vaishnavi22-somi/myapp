require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = 8080;

// MongoDB URL (you can also import from secret.js if you prefer)
//const url = "mongodb://127.0.0.1:27017";
mongoose.connect(uri)
.then(()=>console.log("Connected to MongoDB Atlas"))
.catch(err=>console.log("MongoDB Connection Error:",err));
const dbName = "people";
let myDB;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("✅ Connected to MongoDB");
    myDB = client.db(dbName).collection("friends");
  })
  .catch((err) => console.error("❌ Connection failed:", err));

// Routes
app.route("/users")
  // ➕ POST: Add new user
  .post((req, res) => {
    console.log("Received data:", req.body);
    myDB.insertOne(req.body)
      .then((result) => {
        res.json({ message: "User added successfully", data: result });
      })
      .catch((err) => res.status(500).json({ error: err }));
  })

  // 📋 GET: Fetch all users
  .get((req, res) => {
    myDB.find().toArray()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json({ error: err }));
  })

  // ✏️ PUT: Update user (for example by name)
  .put((req, res) => {
    const { oldName, newName } = req.body;
    myDB.updateOne({ name: oldName }, { $set: { name: newName } })
      .then(() => res.json({ message: "User updated successfully" }))
      .catch((err) => res.status(500).json({ error: err }));
  });

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
// DELETE user by name
app.delete("/users/:name", (req, res) => {
  const name = req.params.name;
  myDB.deleteOne({ name })
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(err => res.status(500).json({ error: err }));
});
// Start server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
