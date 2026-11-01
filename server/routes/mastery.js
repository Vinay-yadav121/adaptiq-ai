const express = require("express");
const Attempt = require("../models/Attempt");
const Topic = require("../models/Topic");
const requireAuth = require("../middleware/auth");
const { summarizeTopics } = require("../utils/topicStats");

const router = express.Router();

const ML_URL = process.env.ML_URL || "http://localhost:8000";
const DIFFICULTY = { easy: 1, medium: 2, hard: 3 };

// GET /api/mastery -> predicted chance of answering each topic correctly next time
router.get("/", requireAuth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.userId }).select("topicResults");
    const stats = summarizeTopics(attempts);
    if (stats.length === 0) return res.json([]);

    // Accuracy across all topics together
    const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0);
    const totalAsked = stats.reduce((sum, s) => sum + s.total, 0);
    const overallAccuracy = totalAsked ? (totalCorrect / totalAsked) * 100 : 50;

    const topics = await Topic.find({ _id: { $in: stats.map((s) => s.topic) } }).populate(
      "subject",
      "name"
    );
    const topicById = new Map(topics.map((t) => [String(t._id), t]));

    const results = await Promise.all(
      stats.map(async (s) => {
        const topic = topicById.get(s.topic);

        const response = await fetch(`${ML_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic_accuracy: s.accuracy,
            questions_answered: s.total,
            overall_accuracy: Math.round(overallAccuracy * 10) / 10,
            difficulty: DIFFICULTY[topic && topic.difficulty] || 2,
          }),
        });
        if (!response.ok) throw new Error("ML service returned an error");
        const prediction = await response.json();

        return {
          topicId: s.topic,
          topic: topic ? topic.name : "Unknown topic",
          subject: topic && topic.subject ? topic.subject.name : null,
          accuracy: s.accuracy,
          questionsAnswered: s.total,
          probability: prediction.probability_correct,
          mastery: prediction.mastery,
        };
      })
    );

    results.sort((a, b) => a.probability - b.probability); // weakest first
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not get mastery predictions" });
  }
});

module.exports = router;