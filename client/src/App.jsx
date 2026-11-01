import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import { QuizList, QuizPage } from "./Quiz";
import "./dashboard.css";

const API = "http://localhost:5001/api";

function Dashboard() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [mastery, setMastery] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    function load(path) {
      return fetch(`${API}${path}`, { headers }).then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      });
    }

    load("/auth/me")
      .then((data) => data && setUser(data))
      .catch(() => setError("Could not load your profile."));
    load("/subjects")
      .then((data) => data && setSubjects(data))
      .catch(() => setError("Could not load subjects."));
    load("/attempts?limit=5")
      .then((data) => data && setAttempts(data))
      .catch(() => setError("Could not load your attempts."));
    load("/attempts/topics")
      .then((data) => data && setTopics(data))
      .catch(() => setError("Could not load topic performance."));
    load("/mastery")
      .then((data) => data && setMastery(data))
      .catch(() => setMastery([]));
  }, [token]);

  return (
    <div className="dashboard">
      <h1>AdaptIQ AI Dashboard</h1>
      {error && <p>{error}</p>}
      {user ? <p>Welcome, {user.name}!</p> : !error && <p>Loading...</p>}

      <p>
        <Link to="/quizzes">Take a quiz</Link>
      </p>

      <h2>Predicted mastery</h2>
      {mastery.length === 0 ? (
        <p>Predictions appear once you take a quiz (the ML service must be running).</p>
      ) : (
        <ul className="subject-list">
          {mastery.map((m) => (
            <li key={m.topicId}>
              <strong>
                {m.topic} <em className={`mastery-badge ${m.mastery}`}>{m.mastery}</em>
              </strong>
              <span>
                {m.subject} - {Math.round(m.probability * 100)}% chance of getting the next
                question right
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2>Topic performance</h2>
      {topics.length === 0 ? (
        <p>Take a quiz to see how you are doing on each topic.</p>
      ) : (
        <ul className="subject-list">
          {topics.map((t) => (
            <li key={t.topicId}>
              <strong>
                {t.topic} {t.weak && <em className="weak-badge">weak</em>}
              </strong>
              <span>
                {t.subject} - {t.accuracy}% ({t.correct}/{t.total} correct)
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2>Recent attempts</h2>
      {attempts.length === 0 ? (
        <p>No attempts yet.</p>
      ) : (
        <ul className="subject-list">
          {attempts.map((a) => (
            <li key={a.id}>
              <strong>{a.quiz ? a.quiz.title : "Quiz"}</strong>
              <span>
                {a.score}/{a.total} ({a.percent}%) on {new Date(a.takenAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2>Subjects</h2>
      <ul className="subject-list">
        {subjects.map((s) => (
          <li key={s._id}>
            <strong>{s.name}</strong>
            <span>{s.description}</span>
          </li>
        ))}
      </ul>

      <button onClick={logout}>Log out</button>
    </div>
  );
}

// Blocks access to a page unless the student has a token
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;