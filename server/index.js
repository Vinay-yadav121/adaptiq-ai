require("dotenv").config(); // loads .env into process.env

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const studentsRoute = require("./routes/students");

const app = express();
app.use(cors());

app.use("/api/students", studentsRoute);

app.get("/", (req, res) => {
  res.send("AdaptIQ AI server is running!");
});

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});