const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Middleware to restrict access to /home
app.use("/home", (req, res, next) => {
  if (!req.session.userInfo || req.session.userInfo.age < 13) {
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


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
