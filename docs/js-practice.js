// const studentName = "Vinay";
// let quizScore = 70;

// quizScore = 85; // this works, because quizScore uses let

// console.log(studentName + " scored " + quizScore);

// studentName = "Rahul"; // trying to change a const

//OBJECTS
// const student = {
//   name: "Vinay",
//   quizScore: 70,
//   weakTopics: ["Recursion", "SQL Joins"]
// };

// console.log(student.name + " needs to revise: " + student.weakTopics[0]);

// student.quizScore = 88;
// console.log(student.name + "'s new score: " + student.quizScore);

// student.weakTopics.push("React Hooks"); // adds a new item to the array
// console.log(student.weakTopics);

//FUNCTIONS
// function getGrade(score) {
//   if (score >= 75) {
//     return "High mastery";
//   } else if (score >= 40) {
//     return "Medium mastery";
//   } else {
//     return "Low mastery";
//   }
// }

// console.log(getGrade(85)); // High mastery
// console.log(getGrade(50)); // Medium mastery
// console.log(getGrade(20)); // Low mastery


//ARROW FUNCTIONs
// const getGrade = (score) => {
// //   if (score >= 75) return "High mastery";
// //   if (score >= 40) return "Medium mastery";
// //   return "Low mastery";
// // };


//  ASYNC/AWAIT
// function delay(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms); // wait `ms` milliseconds, then finish
//   });
// }
// async function showMessage() {
//   console.log("Fetching student data...");
//   await delay(2000); // pause here for 2 seconds
//   console.log("Data loaded!");
// }
// showMessage();


//FETCH
async function getJoke() {
  const response = await fetch("https://official-joke-api.appspot.com/random_joke");
  const data = await response.json(); // convert the reply text into a JS object
  console.log(data.setup);
  console.log(data.punchline);
}

getJoke();