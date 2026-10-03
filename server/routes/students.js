const express = require("express");
const router = express.Router();

// Temporary hardcoded data. Later this will come from MongoDB.
const students = [
  { id: 1, name: "Vinay", score: 88 },
  { id: 2, name: "Rahul", score: 55 },
  { id: 3, name: "Aisha", score: 30 },
  { id: 4, name: "Priya", score: 100 },
];

// GET /api/students
router.get("/", (req, res) => {
  res.json(students);
});

module.exports = router;