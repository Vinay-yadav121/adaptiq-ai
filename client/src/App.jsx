function StudentCard({ name, score }) {
  return (
    <div style={{ border: "1px solid gray", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <h2>{name}</h2>
      <p>Score: {score}</p>
    </div>
  );
}

function App() {
  const students = [
    { id: 1, name: "Vinay", score: 88 },
    { id: 2, name: "Rahul", score: 55 },
    { id: 3, name: "Aisha", score: 30 },
    { id: 4, name: "Priya", score: 72 },
  ];

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