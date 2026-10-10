require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const students = [
  { name: "Vinay", score: 88 },
  { name: "Rahul", score: 55 },
  { name: "Aisha", score: 30 },
  { name: "Priya", score: 100 },
];

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Student.deleteMany({}); // clear any old data first, so we don't get duplicates
  console.log("Cleared old students");

  await Student.insertMany(students); // insert all 4 at once
  console.log("Inserted students:", students.length);

  await mongoose.disconnect();
  console.log("Done, disconnected");
}

seedDatabase();