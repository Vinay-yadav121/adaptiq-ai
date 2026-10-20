const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const Attempt = mongoose.model("Attempt", attemptSchema);

module.exports = Attempt;