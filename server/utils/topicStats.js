// Combines many attempts' topicResults into one stats row per topic.
function summarizeTopics(attempts) {
  const byTopic = new Map();

  for (const attempt of attempts) {
    for (const r of attempt.topicResults || []) {
      const key = String(r.topic);
      const row = byTopic.get(key) || { topic: key, correct: 0, total: 0, attempts: 0 };
      row.correct += r.correct;
      row.total += r.total;
      row.attempts += 1;
      byTopic.set(key, row);
    }
  }

  return [...byTopic.values()].map((row) => ({
    ...row,
    accuracy: row.total === 0 ? 0 : Math.round((row.correct / row.total) * 100),
  }));
}

// A topic is "weak" below 60% once at least 3 questions have been answered on it.
function isWeak(row, threshold = 60, minQuestions = 3) {
  return row.total >= minQuestions && row.accuracy < threshold;
}

module.exports = { summarizeTopics, isWeak };