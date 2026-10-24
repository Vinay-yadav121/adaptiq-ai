require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("./models/Subject");
const Topic = require("./models/Topic");
const Quiz = require("./models/Quiz");

// Each entry: subject, its topics, and a quiz. A question is
// [topic name, question text, options, index of the correct option]
const data = [
  {
    name: "Data Structures & Algorithms",
    description: "Core DSA concepts for interviews and coursework",
    topics: ["Arrays", "Linked Lists", "Recursion"],
    quizTitle: "DSA Basics",
    questions: [
      ["Arrays", "What is the time complexity of accessing an array element by index?", ["O(n)", "O(log n)", "O(1)", "O(n^2)"], 2],
      ["Arrays", "Which technique finds a pair with a given sum in a sorted array in O(n)?", ["Bubble sort", "Two pointers", "Recursion", "Binary tree"], 1],
      ["Linked Lists", "What does the last node of a singly linked list point to?", ["The head", "The previous node", "null", "Itself"], 2],
      ["Linked Lists", "Which is O(1) on a singly linked list when you only have the head pointer?", ["Search for a value", "Delete the last node", "Insert at the tail", "Insert at the head"], 3],
      ["Recursion", "What must every recursive function have to avoid infinite calls?", ["A base case", "A loop", "A global variable", "Two parameters"], 0],
    ],
  },
  {
    name: "Web Development",
    description: "Frontend and backend web fundamentals",
    topics: ["React Basics", "Express & APIs"],
    quizTitle: "Web Development Basics",
    questions: [
      ["React Basics", "Which hook stores a changing value inside a component?", ["useEffect", "useContext", "useState", "useMemo"], 2],
      ["React Basics", "What is JSX?", ["A database", "A syntax that looks like HTML inside JavaScript", "A CSS framework", "A web server"], 1],
      ["React Basics", "In a React list, what does the 'key' prop help with?", ["Styling items", "Encrypting data", "Identifying which items changed", "Sending requests"], 2],
      ["Express & APIs", "Which HTTP method is normally used to create a new resource?", ["GET", "POST", "DELETE", "HEAD"], 1],
      ["Express & APIs", "What does HTTP status code 404 mean?", ["Server crashed", "Not authorised", "Resource not found", "Created"], 2],
    ],
  },
  {
    name: "Aptitude",
    description: "Quantitative aptitude for placement tests",
    topics: ["Percentages", "Ratio and Proportion", "Time and Work"],
    quizTitle: "Aptitude Basics",
    questions: [
      ["Percentages", "What is 20% of 250?", ["25", "40", "50", "60"], 2],
      ["Percentages", "A price rises from 200 to 250. What is the percentage increase?", ["20%", "25%", "50%", "10%"], 1],
      ["Ratio and Proportion", "If A:B = 2:3 and B:C = 3:4, what is A:C?", ["1:2", "2:3", "3:4", "1:3"], 0],
      ["Ratio and Proportion", "Divide 100 in the ratio 3:2. What is the larger part?", ["40", "50", "60", "70"], 2],
      ["Time and Work", "A does a job in 10 days and B in 15 days. Working together, how many days do they need?", ["5", "6", "7.5", "12.5"], 1],
    ],
  },
];

async function seedQuizzes() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const item of data) {
    // Create the subject only if it doesn't exist yet
    const subject = await Subject.findOneAndUpdate(
      { name: item.name },
      { name: item.name, description: item.description },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Create each topic only if it doesn't exist yet, and remember its _id
    const topicIds = {};
    for (const topicName of item.topics) {
      const topic = await Topic.findOneAndUpdate(
        { subject: subject._id, name: topicName },
        { subject: subject._id, name: topicName },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      topicIds[topicName] = topic._id;
    }

    // Turn each [topic, text, options, correct] row into a question object
    const questions = item.questions.map(([topicName, text, options, correctIndex]) => ({
      text,
      options,
      correctIndex,
      topic: topicIds[topicName],
    }));

    // Create or update the quiz by title
    await Quiz.findOneAndUpdate(
      { title: item.quizTitle },
      { title: item.quizTitle, subject: subject._id, questions },
      { upsert: true, returnDocument: "after" }
    );

    console.log(`Ready: ${item.name} (${item.topics.length} topics, ${questions.length} questions)`);
  }

  await mongoose.disconnect();
  console.log("Done, disconnected");
}

seedQuizzes();