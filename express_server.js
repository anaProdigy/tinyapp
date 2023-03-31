const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

//Why in an object?????
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; //send variables inside an object
  //console.log(templateVars);
  res.render("urls_index", templateVars); //sending variables to an EJS template urls_index
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars); // 2nd
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/*
Design backend instagram
 /posts/:id => customer /post/
 
 /followers/:id
 /following
 /reels
*/