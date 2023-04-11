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

//Finding a user in the users object from its email
function findUserByEmail(email, users) {
  for (let user of users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

//Why in an object?????
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register", templateVars);
});
//a GET /login endpoint that responds with a new login form template
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
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
  const { email, password } = req.body;

  const user = findUserByEmail(email, users);
  //If a user with that e-mail cannot be found, return a response with a 403 status code.
  if (!user) {
    return res.status(403).send("Email not found");
  }
  //check if passward matches
  if (user.password !== password) {
    return res.status(403).send("Password is incorrect");
  }
 //set the user_id cookie with the matching user's random ID, then redirect to /urls.
  res.cookie("user_id", user.id);
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
  // If email or password are empty strings, send a 400 Bad Request response
  if (!email || !password) {
    return res.status(400);
  }
  // Check if email already exists in the users object
  if (findUserByEmail(email, users)) {
    return res.status(400);
  }
  // Add the user information to the `users` object using the randomly generated ID as the key
  users[userRandomId] = { email, password };
  //set a user_id cookie containing the user's newly generated ID
  res.cookie("user_id", userRandomId);
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  //include this var with username so it doesnt throw an error on this route
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]  // include username on every template
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

