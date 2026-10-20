const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [String], // an array of strings
    required: true,
  },
  correctAnswerIndex: {
    type: Number, // which position in "options" is correct (0, 1, 2, or 3)
    required: true,
  },
});

const quizSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  questions: [questionSchema], // an array of question sub-documents
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;