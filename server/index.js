require("dotenv").config(); // loads .env into process.env

const express = require("express");
const cors = require("cors");
const studentsRoute = require("./routes/students");

const app = express();
app.use(cors());

app.use("/api/students", studentsRoute);

app.get("/", (req, res) => {
  res.send("AdaptIQ AI server is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});