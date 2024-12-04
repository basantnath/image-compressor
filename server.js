const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to restrict access to /home
let userInfo = null;
app.use("/home", (req, res, next) => {
  if (!userInfo || userInfo.age < 13) {
    return res.redirect("/restricted");
  }
  next();
});
app.post("/submit", (req, res) => {
  const { name, age, source } = req.body;

  if (name && age && source) {
    userInfo = { name, age, source };
    return res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.get("/restricted", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "restricted.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Catch-all route for 404 Not Found
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
