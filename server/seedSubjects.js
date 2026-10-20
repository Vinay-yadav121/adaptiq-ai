require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("./models/Subject");
const Topic = require("./models/Topic");

async function seedSubjects() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Topic.deleteMany({});
  await Subject.deleteMany({});
  console.log("Cleared old subjects and topics");

  // Create subjects first, since topics need to reference them
  const dsa = await Subject.create({
    name: "Data Structures & Algorithms",
    description: "Core DSA concepts for interviews and coursework",
  });

  const webdev = await Subject.create({
    name: "Web Development",
    description: "Frontend and backend web fundamentals",
  });

  // Create topics, linking each to its subject's _id
  await Topic.insertMany([
    { name: "Arrays", subject: dsa._id },
    { name: "Linked Lists", subject: dsa._id },
    { name: "Recursion", subject: dsa._id },
    { name: "React Basics", subject: webdev._id },
    { name: "Express & APIs", subject: webdev._id },
  ]);

  console.log("Inserted 2 subjects and 5 topics");

  await mongoose.disconnect();
  console.log("Done, disconnected");
}

seedSubjects();