const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId, // links to one Subject document
    ref: "Subject", // tells Mongoose this ID refers to the Subject model
    required: true,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;