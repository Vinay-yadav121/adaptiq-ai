const mongoose = require("mongoose");

const topicResultSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    correct: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    timeTakenSec: { type: Number, min: 0 },
    topicResults: [topicResultSchema],
  },
  { timestamps: true }
);

attemptSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Attempt", attemptSchema);