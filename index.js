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

const contentChecker = (req, res, next)=> {
  const {firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle} = req.body;
  req.errors = [];

  if(!firstName){
    req.errors.push('Please provide a first name.');
  }
  if (!lastName) {
    req.errors.push('Please provide a last name.');
  }
  if (!email) {
    req.errors.push('Please provide an email.');
  }
  if (!password) {
    req.errors.push('Please provide a password.');
  }
  if (confirmedPassword !== password) {
    req.errors.push('The provided values for the password and password confirmation fields did not match.');
  }
  next();
}

const interestingChecker = (req, res, next) => {
  const {age, favoriteBeatle} = req.body;
  if(!age){
    req.errors.push('age is required');
  }
  if(!parseInt(age) || age >= 120 || age <= 0){
    req.errors.push('age must be a valid age');
  }
  if (!favoriteBeatle) {
    req.errors.push('favoriteBeatle is required');
  }
  if (favoriteBeatle === 'Scooby-Doo') {
    req.errors.push('favoriteBeatle must be a real Beatle member');
  }
  next();
}

app.get("/create", csrfProtection, (req, res) => {
  res.render('create-form', { csrfToken: req.csrfToken(), errors: [], user: {}});
});


app.post("/create", csrfProtection, contentChecker, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword, iceCream } = req.body;
  const user = {firstName, lastName, email, iceCream};
  if (req.errors.length > 0){
    res.render('create-form', {csrfToken: req.csrfToken(), errors: req.errors, user});
  } else {
    users.push({
      id: users.length + 1,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      iceCream: 'yes'
    });
   res.redirect('/');
  }
});

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render('create-interesting', { csrfToken: req.csrfToken(), errors: [], user: {}});
});


app.post("/create-interesting", csrfProtection, contentChecker, interestingChecker, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream} = req.body;
  const user = {firstName, lastName, email, age, favoriteBeatle, iceCream}
  // console.log(iceCream)
  if (req.errors.length > 0){
    res.render('create-interesting', {csrfToken: req.csrfToken(), errors: req.errors, user})
  } else {
    users.push({
      id: users.length +1,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      age,
      favoriteBeatle,
      iceCream: iceCream === 'on'
    });
    // console.log('here')
   res.redirect('/');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
