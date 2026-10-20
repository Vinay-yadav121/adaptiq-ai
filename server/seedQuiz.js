require("dotenv").config();
const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");

async function seedQuiz() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Quiz.deleteMany({});
  console.log("Cleared old quizzes");

  await Quiz.create({
    topic: "6ad72fa08fcaf0b22a80c60a", // Arrays topic
    questions: [
      {
        questionText: "What is the time complexity of accessing an array element by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswerIndex: 0,
      },
      {
        questionText: "Which operation is generally slow in a plain array?",
        options: ["Accessing by index", "Inserting at the beginning", "Reading the length", "Both are fast"],
        correctAnswerIndex: 1,
      },
      {
        questionText: "Arrays store elements in:",
        options: ["Random memory locations", "Contiguous memory locations", "Linked nodes", "Hash buckets"],
        correctAnswerIndex: 1,
      },
    ],
  });

  console.log("Inserted 1 quiz with 3 questions");

  await mongoose.disconnect();
  console.log("Done, disconnected");
}

seedQuiz();