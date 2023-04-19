const { urlDatabase } = require('./data');
//Finding a user in the users object from its email
const findUserByEmail = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
};

const generateRandomString = function() {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
};

const urlsForUser = function(id) {
  const userUrls = {};
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      userUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return userUrls;
};

const sendError = (userId, url) => {
  //check if the user_id cookie exists
  if (!userId) {
    return {
      errorStatus: 401,
      errorMessage: "You must be logged in to access this page."
    };
  }
  //check if the requested URL exists in the urlDatabase object
  if (!url) {
    return {
      errorStatus: 404,
      errorMessage: "Error: URL not found"
    };
  }

  if (url.userID !== userId) {
    return {
      errorStatus: 401,
      errorMessage: "This URL does not belong to you"
    };
  }

  return {};
};
module.exports = { findUserByEmail, urlsForUser, generateRandomString, sendError };
