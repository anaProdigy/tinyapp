const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//translates, or parses the body from Buffer to human readable data;
//The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

//Why in an object?????
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; //send variables inside an object
  console.log(templateVars);
  res.render("urls_index", templateVars); //sending variables to an EJS template urls_index
});

app.post("/urls", (req, res) => {
  let newShortId = generateRandomString();
  //console.log(newShortId)
  urlDatabase[newShortId] = req.body.longURL;
  //console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${newShortId}`); 
});
//console.log(urlDatabase)

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars); // 2nd
});

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
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