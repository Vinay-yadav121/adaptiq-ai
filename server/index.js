// Load the libraries we installed
const express = require("express");
const cors = require("cors");

// Create the Express app
const app = express();

// Allow the React app (running on a different port) to call this server
app.use(cors());

// Temporary hardcoded data. Later this will come from MongoDB.
const students = [
  { id: 1, name: "Vinay", score: 88 },
  { id: 2, name: "Rahul", score: 55 },
  { id: 3, name: "Aisha", score: 30 },
  { id: 4, name: "Priya", score: 72 },
];

// Route 1: a simple check that the server is alive
app.get("/", (req, res) => {
  res.send("AdaptIQ AI server is running!");
});

// Route 2: send the list of students as JSON
app.get("/api/students", (req, res) => {
  res.json(students);
});

// Start listening for requests
const PORT = 5001;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});