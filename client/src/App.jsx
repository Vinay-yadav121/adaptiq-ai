import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import "./dashboard.css";

function Dashboard() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    fetch("http://localhost:5001/api/auth/me", { headers })
      .then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setError("Could not load your profile."));

    fetch("http://localhost:5001/api/subjects", { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setSubjects(data))
      .catch(() => setError("Could not load subjects."));
  }, [token]);

  return (
    <div className="dashboard">
      <h1>AdaptIQ AI Dashboard</h1>
      {error && <p>{error}</p>}
      {user ? <p>Welcome, {user.name}!</p> : !error && <p>Loading...</p>}

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
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;