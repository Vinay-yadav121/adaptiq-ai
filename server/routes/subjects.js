const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Topic = require("../models/Topic");

// GET /api/subjects — list all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// GET /api/subjects/:subjectId/topics — list topics for one subject
router.get("/:subjectId/topics", async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

module.exports = router;