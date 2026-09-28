import { useState, useEffect } from "react";

function StudentCard({ name, score }) {
  return (
    <div style={{ border: "1px solid gray", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <h2>{name}</h2>
      <p>Score: {score}</p>
    </div>
  );
}

function App() {
  // State: the list of students, empty until the server replies
  const [students, setStudents] = useState([]);

  // Runs once, after the page first appears
  useEffect(() => {
    async function loadStudents() {
      const response = await fetch("http://localhost:5001/api/students");
      const data = await response.json();
      setStudents(data);
    }

    loadStudents();
  }, []);

  return (
    <div>
      <h1>AdaptIQ AI</h1>
      {students.map((student) => (
        <StudentCard key={student.id} name={student.name} score={student.score} />
      ))}
    </div>
  );
}

export default App;