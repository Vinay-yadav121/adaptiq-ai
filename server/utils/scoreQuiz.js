// Scores a quiz. No database code, so it is easy to test.
// answers: [{ questionId, selected }]  (selected = index of the chosen option)
function scoreQuiz(quiz, answers) {
  const selectedById = new Map((answers || []).map((a) => [String(a.questionId), a.selected]));
  const topics = new Map();
  const review = [];
  let score = 0;

  for (const q of quiz.questions) {
    const selected = selectedById.get(String(q._id));
    const isCorrect = Number.isInteger(selected) && selected === q.correctIndex;
    if (isCorrect) score += 1;

    const key = String(q.topic);
    const row = topics.get(key) || { topic: q.topic, correct: 0, total: 0 };
    row.total += 1;
    if (isCorrect) row.correct += 1;
    topics.set(key, row);

    review.push({
      questionId: q._id,
      selected: Number.isInteger(selected) ? selected : null,
      correctIndex: q.correctIndex,
      isCorrect,
    });
  }

  return {
    score,
    total: quiz.questions.length,
    topicResults: [...topics.values()],
    review,
  };
}

module.exports = scoreQuiz;