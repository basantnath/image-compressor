const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "1011",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to restrict access to /home
app.use("/home", (req, res, next) => {
  const userInfo = req.session.userInfo;
  if (!userInfo || userInfo.age < 13) {
    return res.redirect("/restricted");
  }
  next();
});
app.post("/submit", (req, res) => {
  const { name, age, source } = req.body;

  if (name && age && source) {
    req.session.userInfo = { name, age, source };
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

app.listen(PORT);
