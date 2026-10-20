const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const requireAuth = require("../middleware/auth");

// GET /api/quizzes/topic/:topicId — fetch the quiz for a topic (without revealing correct answers)
router.get("/topic/:topicId", requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ topic: req.params.topicId });
    if (!quiz) {
      return res.status(404).json({ error: "No quiz found for this topic" });
    }

    // Build a safe version that hides correctAnswerIndex from the student
    const safeQuiz = {
      _id: quiz._id,
      topic: quiz.topic,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.json(safeQuiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// POST /api/quizzes/:quizId/submit — submit answers and get a score
router.post("/:quizId/submit", requireAuth, async (req, res) => {
  try {
    const { answers } = req.body; // expected: array of selected option indexes, in question order

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let correctCount = 0;
    quiz.questions.forEach((question, i) => {
      if (answers[i] === question.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    res.json({
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

module.exports = router;