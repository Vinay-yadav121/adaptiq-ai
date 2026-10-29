const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const requireAuth = require("../middleware/auth");
const scoreQuiz = require("../utils/scoreQuiz");
const recordAttempt = require("../utils/recordAttempt");

// GET /api/quizzes  -> list of quizzes (no questions)
router.get("/", requireAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort("title");
    res.json(
      quizzes.map((q) => ({
        id: q._id,
        title: q.title,
        subject: q.subject,
        questionCount: q.questions.length,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// GET /api/quizzes/:id  -> one quiz WITHOUT the correct answers
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json({
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        text: q.text,
        options: q.options,
      })),
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid quiz id" });
  }
});

// POST /api/quizzes/:id/submit
// body: { answers: [{ questionId, selected }], timeTakenSec? }
router.post("/:id/submit", requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const { answers, timeTakenSec } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "answers must be an array" });
    }

    const result = scoreQuiz(quiz, answers);

    const attempt = await recordAttempt({
      userId: req.userId,
      quizId: quiz._id,
      subjectId: quiz.subject,
      score: result.score,
      total: result.total,
      timeTakenSec,
      topicResults: result.topicResults,
    });

    res.status(201).json({
      attemptId: attempt._id,
      score: result.score,
      total: result.total,
      percent: Math.round((result.score / result.total) * 100),
      review: result.review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

module.exports = router;