import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { API } from "./config";

// Page 1: list of all quizzes
export function QuizList() {
  const { token, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/quizzes`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => data && setQuizzes(data))
      .catch(() => setError("Could not load quizzes."));
  }, [token]);

  return (
    <div className="dashboard">
      <h1>Quizzes</h1>
      {error && <p>{error}</p>}
      <ul className="subject-list">
        {quizzes.map((q) => (
          <li key={q.id}>
            <strong>
              <Link to={`/quiz/${q.id}`}>{q.title}</Link>
            </strong>
            <span>{q.questionCount} questions</span>
          </li>
        ))}
      </ul>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}

// Page 2: take one quiz and see the result
export function QuizPage() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: chosenIndex }
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    fetch(`${API}/quizzes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => data && setQuiz(data))
      .catch(() => setError("Could not load this quiz."));
  }, [id, token]);

  function choose(questionId, index) {
    setAnswers({ ...answers, [questionId]: index });
  }

  function submit() {
    const body = {
      answers: Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selected,
      })),
      timeTakenSec: Math.round((Date.now() - startedAt) / 1000),
    };

    fetch(`${API}/quizzes/${id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submit failed");
        return res.json();
      })
      .then((data) => setResult(data))
      .catch(() => setError("Could not submit your answers."));
  }

  if (error) return <div className="dashboard"><p>{error}</p></div>;
  if (!quiz) return <div className="dashboard"><p>Loading...</p></div>;

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const reviewById = result
    ? Object.fromEntries(result.review.map((r) => [r.questionId, r]))
    : {};

  return (
    <div className="dashboard quiz">
      <h1>{quiz.title}</h1>

      {result && (
        <p className="score">
          You scored {result.score} / {result.total} ({result.percent}%)
        </p>
      )}

      {quiz.questions.map((q, n) => {
        const review = reviewById[q.id];
        return (
          <div key={q.id} className="question">
            <p>
              {n + 1}. {q.text}
            </p>
            {q.options.map((opt, i) => {
              let cls = "option";
              if (!result && answers[q.id] === i) cls += " chosen";
              if (review && i === review.correctIndex) cls += " correct";
              if (review && i === review.selected && !review.isCorrect) cls += " wrong";
              return (
                <label key={i} className={cls}>
                  <input
                    type="radio"
                    name={q.id}
                    disabled={!!result}
                    checked={answers[q.id] === i}
                    onChange={() => choose(q.id, i)}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        );
      })}

      {!result && (
        <button onClick={submit} disabled={!allAnswered}>
          Submit answers
        </button>
      )}
      <p>
        <Link to="/quizzes">Back to quizzes</Link>
      </p>
    </div>
  );
}