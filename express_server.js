const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

//translates, or parses the body from Buffer to human readable data;
//The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());; //to pass and remember cookies
app.set("view engine", "ejs");


// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
}

function urlsForUser(id) {
  userUrls = {};
for(let shortUrl in urlDatabase) {
  if (urlDatabase[shortUrl].userID === id) {
    userUrls[shortUrl] = urlDatabase[shortUrl]
  }
}
return userUrls;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

//Why in an object?????
app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (user) {
    return res.redirect("/urls");
  }

  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register", templateVars);
});
//a GET /login endpoint that responds with a new login form template
app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if(user) {
    return res.redirect("/urls")
  }
  const templateVars = {
    user: false
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (!user) {
    return res.send("You should be logged in to see your urls");
  }

  const userUrls = urlsForUser(userId)
  const templateVars = {
    urls: userUrls,
    user: user
  }; //send variables inside an object
  res.render("urls_index", templateVars); //sending variables to an EJS template urls_index
});

app.post("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if(!user) {
    res.status(401).send("You must be logged in to shorten your URL")
  }

  let newShortId = generateRandomString();
  
  urlDatabase[newShortId] = {
    longURL: req.body.longURL, 
    userID: userId
  }
  
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

//clears the user_id cookie and redirects the user back to the /login page
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//Registration Handler
app.post("/register", (req, res) => {
  let userRandomId = generateRandomString();
  const { email, password } = req.body;
  // If email or password are empty strings, send a 400 Bad Request response
  if (!email || !password) {
    return res.status(400).send("Fields cannot be empty");
  }
  // Check if email already exists in the users object
  if (findUserByEmail(email, users)) {
    return res.status(400).send("This email is taken");
  }
  // Add the user information to the `users` object using the randomly generated ID as the key
  users[userRandomId] = { email, password, id: userRandomId };
  //set a user_id cookie containing the user's newly generated ID
  res.cookie("user_id", userRandomId);
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (!user) {
    return res.redirect("/login");
  }
  //include this var with user_id so it doesnt throw an error on this route
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  if(!urlDatabase[req.params.id]) {
    return res.send("Url is not available")
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies["user_id"]]  // include user_id on every template

  };
  res.render("urls_show", templateVars); // 2nd
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = { 
    longURL: req.body.longURL,
    userID: userId
  }
  //urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

//access short url
app.get("/u/:id", (req, res) => {
  const url = urlDatabase[req.params.id];

  if(!url) {
    return res.status(404).send("Short URL not found.")
  }
  res.redirect(url.longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

