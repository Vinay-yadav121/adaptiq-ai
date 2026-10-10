const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET /api/students — now reads from MongoDB instead of a hardcoded array
router.get("/", async (req, res) => {
  try {
    const students = await Student.find(); // fetch all students from the database
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;