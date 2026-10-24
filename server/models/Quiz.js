const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: {
    type: [String],
    validate: [(v) => v.length >= 2 && v.length <= 6, "A question needs 2 to 6 options"],
  },
  correctIndex: { type: Number, required: true, min: 0 },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);