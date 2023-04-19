const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
const { urlDatabase, users } = require('./data');
const { findUserByEmail, urlsForUser, generateRandomString } = require('./helpers')
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["one"]
}));
app.set("view engine", "ejs");


//ROUTES
app.get("/", (req, res) => {
  res.redirect("/login")
  // const userId = req.session.user_id;
  // const user = users[userId];

  // if (user) {
  //   return res.redirect("/urls");
  // }
  // const templateVars = {
  //   user: false
  // };
  // res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (user) {
    return res.redirect("/urls");
  }

  const templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("register", templateVars);
});

//a GET /login endpoint that responds with a new login form template
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: false
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.send("You should be logged in to see your urls");
  }

  const userUrls = urlsForUser(userId);
  const templateVars = {
    urls: userUrls,
    user
  }; 
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    res.status(401).send("You must be logged in to shorten your URL");
  }

  const newShortId = generateRandomString();

  urlDatabase[newShortId] = {
    longURL: req.body.longURL,
    userID: userId
  };

  res.redirect(`/urls/${newShortId}`);
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = findUserByEmail(email, users);
  //check if a user with that e-mail cannot be found
  if (!user) {
    return res.status(403).send("Email not found");
  }
  //check if passward matches
  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(403).send("Password is incorrect");
  }
  //set the user_id session with the matching user's random ID
  req.session.user_id = user.id;
  res.redirect("/urls");
});

//clears the user_id session and redirects the user back to the /login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Registration Handler
app.post("/register", (req, res) => {
  const userRandomId = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  // check if email or password are empty strings
  if (!email || !password) {
    return res.status(400).send("Fields cannot be empty");
  }
  // Check if email already exists in the users object
  if (findUserByEmail(email, users)) {
    return res.status(400).send("This email is taken");
  }
  // Add the user information to the `users` object using the randomly generated ID as the key
  users[userRandomId] = { email, hashedPassword, id: userRandomId };
  // Set the user_id property of the session cookie to the newly generated ID
  req.session.user_id = userRandomId;
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.redirect("/login");
  }
  //include this var with user_id so it doesnt throw an error on this route
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("urls_new", templateVars);
});

const sendError = ( userId, url, res, msg) => {
  //check if the user_id cookie exists
  if (!userId) {
    return res.status(401).send("You must be logged in to access this page.");
  } 
  //check if the requested URL exists in the urlDatabase object
  else if (!url) {
    return res.status(404).send("Error: URL not found");
  }

  else if (url.userID !== userId) {
    return res.status(401).send("This URL does not belong to you");
  }


}

app.get("/urls/:id", (req, res) => {
  const urlId = req.params.id;
  const url = urlDatabase[urlId];
  const userId = req.session.user_id;

  sendError(userId, url, res);

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session["user_id"]]  
  };
  res.render("urls_show", templateVars); 
});

app.post("/urls/:id", (req, res) => {
  const urlId = req.params.id;
  const url = urlDatabase[urlId];
  const userId = req.session.user_id;

  sendError(userId, url, res);

  urlDatabase[urlId] = {
    longURL: req.body.longURL,
    userID: userId
  };
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const urlId = req.params.id;
  const url = urlDatabase[urlId];
  const userId = req.session.user_id;

  sendError(userId, url, res);
  

  delete urlDatabase[urlId];
  res.redirect("/urls");
});

//access short url
app.get("/u/:id", (req, res) => {
  const url = urlDatabase[req.params.id];

  if (!url) {
    return res.status(404).send("Short URL not found.");
  }
  res.redirect(url.longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

