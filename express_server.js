const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

//translates, or parses the body from Buffer to human readable data;
//The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());; //to pass and remember username
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"] //include username on every template
  }; 
  res.render("register", templateVars); 
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"] //include username on every template
  }; //send variables inside an object
  res.render("urls_index", templateVars); //sending variables to an EJS template urls_index
});

app.post("/urls", (req, res) => {
  let newShortId = generateRandomString();
  //console.log(newShortId)
  urlDatabase[newShortId] = req.body.longURL;
  //console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${newShortId}`);
});



app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//clears the username cookie and redirects the user back to the /urls page
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

//Registration Handler
app.post("/register", (req, res) => {
  let userRandomId = generateRandomString();
  const { email, password } = req.body;
  // Add the user information to the `users` object using the randomly generated ID as the key
  users[userRandomId] = { email, password };
  //set a user_id cookie containing the user's newly generated ID
  res.cookie("user_id", userRandomId);
  res.redirect("/urls");
});


app.post("/register", (req, res) => {
  res.cookie("userRandomId", userRandomId);
  console.log(userRandomId)
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  //include this var with username so it doesnt throw an error on this route
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars );
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] // include username on every template
  };
  res.render("urls_show", templateVars); // 2nd
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

