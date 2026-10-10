const mongoose = require("mongoose");

// Describe the shape of a "student" document
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

// Create a model named "Student" from that shape.
// Mongoose will store these in a collection called "students" (lowercase, plural) automatically.
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;