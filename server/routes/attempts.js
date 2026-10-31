const express = require("express");
const Attempt = require("../models/Attempt");
const Topic = require("../models/Topic");
const requireAuth = require("../middleware/auth");
const { summarizeTopics, isWeak } = require("../utils/topicStats");

const router = express.Router();

// GET /api/attempts -> the logged-in student's recent attempts (newest first)
router.get("/", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const attempts = await Attempt.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("quiz", "title")
      .populate("subject", "name");

    res.json(
      attempts.map((a) => ({
        id: a._id,
        quiz: a.quiz,
        subject: a.subject,
        score: a.score,
        total: a.total,
        percent: Math.round((a.score / a.total) * 100),
        takenAt: a.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

// GET /api/attempts/topics -> accuracy per topic, weakest first
router.get("/topics", requireAuth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.userId }).select("topicResults");
    const stats = summarizeTopics(attempts);

    const topics = await Topic.find({ _id: { $in: stats.map((s) => s.topic) } }).populate(
      "subject",
      "name"
    );
    const topicById = new Map(topics.map((t) => [String(t._id), t]));

    const result = stats
      .map((s) => {
        const t = topicById.get(s.topic);
        return {
          topicId: s.topic,
          topic: t ? t.name : "Unknown topic",
          subject: t && t.subject ? t.subject.name : null,
          correct: s.correct,
          total: s.total,
          attempts: s.attempts,
          accuracy: s.accuracy,
          weak: isWeak(s),
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topic stats" });
  }
});

module.exports = router;