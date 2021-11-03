const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require('csurf');
const { urlencoded } = require("express");
const csrfProtection = csrf({ cookie: true });

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded({ extends: false }));

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render('index', {users});
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('create-form', { csrfToken: req.csrfToken() });
});

app.post("/create", (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  res.render('create-form', {
    firstName,
    lastName,
    email,
    password,
    confirmedPassword
  });
  return;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
