const Attempt = require("../models/Attempt");

// Saves one quiz attempt, including a per-topic breakdown.
async function recordAttempt({ userId, quizId, subjectId, score, total, timeTakenSec, topicResults }) {
  return Attempt.create({
    user: userId,
    quiz: quizId,
    subject: subjectId,
    score,
    total,
    timeTakenSec,
    topicResults,
  });
}

module.exports = recordAttempt;